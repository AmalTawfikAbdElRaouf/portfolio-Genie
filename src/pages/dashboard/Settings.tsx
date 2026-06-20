import { useState, useRef } from "react";
import { Form, Spinner } from "react-bootstrap";
import {
  BsPerson, BsLock, BsLink45Deg, BsPencil, BsCheck2,
  BsShieldCheck, BsKey, BsGoogle, BsGithub, BsLinkedin,
  BsTwitterX, BsTrash3, BsExclamationTriangle,
} from "react-icons/bs";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { setUserData } from "../../store/slices/userSlice";
import styles from "../../style/Settings.module.css";
import { supabase } from "../../services/supabaseClient";

type TabKey = "general" | "security" | "accounts";

interface ConnectedAccount {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  bgColor: string;
  iconColor: string;
}

const Settings = () => {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userData.name || "");
  const [job, setJob] = useState(userData.job || "");
  const [email, setEmail] = useState(userData.email || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [avatar, setAvatar] = useState(userData.avatar || "");

  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { id: "google", name: "Google", icon: <BsGoogle />, connected: true, bgColor: "rgba(234, 67, 53, 0.12)", iconColor: "#ea4335" },
    { id: "github", name: "GitHub", icon: <BsGithub />, connected: true, bgColor: "rgba(255, 255, 255, 0.08)", iconColor: "#fff" },
    { id: "linkedin", name: "LinkedIn", icon: <BsLinkedin />, connected: false, bgColor: "rgba(10, 102, 194, 0.12)", iconColor: "#0a66c2" },
    { id: "twitter", name: "X / Twitter", icon: <BsTwitterX />, connected: false, bgColor: "rgba(255, 255, 255, 0.06)", iconColor: "#ccc" },
  ]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      Swal.fire({ title: "Invalid File", text: "Please upload an image file.", icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }

    // التحقق من حجم الملف (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({ title: "File Too Large", text: "Please upload an image smaller than 2MB.", icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
      return;
    }

    setUploadingPhoto(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      // رفع الصورة على Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // جيب الـ public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

   // حفظ الـ URL في Supabase user metadata
await supabase.auth.updateUser({
  data: { avatar_url: publicUrl }
});

setAvatar(publicUrl);
dispatch(setUserData({ name, job, avatar: publicUrl, email, bio }));

      Swal.fire({ title: "Photo Updated!", text: "Your profile photo has been changed.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 1500, showConfirmButton: false });
    } catch (error: any) {
      Swal.fire({ title: "Upload Failed", text: error.message, icon: "error", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    await new Promise((r) => setTimeout(r, 1200));
    dispatch(setUserData({ name, job, avatar, email, bio }));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    Swal.fire({ title: "Saved!", text: "Your profile has been updated.", icon: "success", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", timer: 1500, showConfirmButton: false });
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone. All your portfolios will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7C3AED",
      confirmButtonText: "Yes, delete my account",
      background: "#1a1040",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: "Deleted", text: "Account deleted successfully.", icon: "success", background: "#1a1040", color: "#fff" });
      }
    });
  };

  const toggleAccount = (id: string) => {
    setAccounts((prev) => prev.map((acc) => (acc.id === id ? { ...acc, connected: !acc.connected } : acc)));
    const acc = accounts.find((a) => a.id === id);
    if (acc) {
      Swal.fire({ title: acc.connected ? "Disconnected" : "Connected", text: `${acc.name} has been ${acc.connected ? "removed from" : "linked to"} your account.`, icon: acc.connected ? "warning" : "success", timer: 1200, showConfirmButton: false, background: "#1a1040", color: "#fff" });
    }
  };

  const navItems: { key: TabKey; icon: React.ReactNode; label: string }[] = [
    { key: "general", icon: <BsPerson size={18} />, label: "General" },
    { key: "security", icon: <BsLock size={18} />, label: "Security" },
    { key: "accounts", icon: <BsLink45Deg size={18} />, label: "Connected Accounts" },
  ];

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.settingsLayout}>
        {/* Left Nav */}
        <nav className={styles.settingsNav}>
          <div className={styles.navTitle}>Settings</div>
          {navItems.map((item) => (
            <button key={item.key} className={`${styles.navItem} ${activeTab === item.key ? styles.active : ""}`} onClick={() => setActiveTab(item.key)}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Content */}
        <div className={styles.settingsContent}>
          {/* General */}
          {activeTab === "general" && (
            <div className={styles.settingsPanel}>
              <div className={styles.panelHeader}>
                <div>
                  <h3 className={styles.panelTitle}><BsPencil size={20} />Personal Details</h3>
                  <p className={styles.panelSubtitle}>Update your personal information and public profile.</p>
                </div>
              </div>

              {/* Avatar */}
              <div className={styles.avatarSection}>
                <div style={{ position: "relative" }}>
                  <img
                    src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=72`}
                    alt="Avatar"
                    className={styles.avatarImage}
                    style={{ opacity: uploadingPhoto ? 0.5 : 1 }}
                  />
                  {uploadingPhoto && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                      <Spinner animation="border" size="sm" style={{ color: "#7C3AED" }} />
                    </div>
                  )}
                </div>
                <div className={styles.avatarInfo}>
                  <h4 className={styles.avatarName}>{name}</h4>
                  <p className={styles.avatarRole}>{job}</p>
                </div>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <button
                  className={styles.avatarUploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? <><Spinner animation="border" size="sm" style={{ width: 14, height: 14, borderWidth: 2 }} /> Uploading...</> : <><BsPencil size={14} /> Change Photo</>}
                </button>
              </div>

              {/* Form */}
              <Form onSubmit={handleSave} className={styles.settingsForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input type="text" className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Job Title</label>
                    <input type="text" className={styles.formInput} value={job} onChange={(e) => setJob(e.target.value)} placeholder="Senior Developer" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input type="email" className={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea className={styles.formTextarea} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the world about yourself..." rows={3} />
                </div>
                <button type="submit" className={`${styles.saveBtn} ${saving ? styles.saving : ""} ${saveSuccess ? styles.success : ""}`} disabled={saving}>
                  {saving ? <><Spinner animation="border" size="sm" style={{ width: 16, height: 16, borderWidth: 2 }} />Saving...</> : saveSuccess ? <><BsCheck2 size={18} />Saved!</> : <><BsCheck2 size={16} />Save Changes</>}
                </button>
              </Form>

              {/* Danger Zone */}
              <div className={styles.dangerZone}>
                <h5 className={styles.dangerTitle}><BsExclamationTriangle size={18} />Danger Zone</h5>
                <p className={styles.dangerDesc}>Once you delete your account, there is no going back. All portfolios and data will be permanently removed.</p>
                <button className={styles.deleteBtn} onClick={handleDeleteAccount}><BsTrash3 size={16} />Delete Account</button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className={styles.settingsPanel}>
              <div className={styles.panelHeader}>
                <div>
                  <h3 className={styles.panelTitle}><BsShieldCheck size={20} />Security Settings</h3>
                  <p className={styles.panelSubtitle}>Manage your password and account security preferences.</p>
                </div>
              </div>
              <div className={styles.securityOption}>
                <div>
                  <p className={styles.securityLabel}>Password</p>
                  <p className={styles.securityHint}>Last changed 3 months ago</p>
                </div>
                <button className={styles.changeBtn} onClick={() => Swal.fire({ title: "Change Password", html: `<input id="current-pw" type="password" placeholder="Current password" class="swal2-input" style="font-size:0.85rem" /><input id="new-pw" type="password" placeholder="New password" class="swal2-input" style="font-size:0.85rem" /><input id="confirm-pw" type="password" placeholder="Confirm password" class="swal2-input" style="font-size:0.85rem" />`, confirmButtonText: "Update Password", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff", preConfirm: () => { const current = (document.getElementById("current-pw") as HTMLInputElement)?.value; const newPw = (document.getElementById("new-pw") as HTMLInputElement)?.value; const confirm = (document.getElementById("confirm-pw") as HTMLInputElement)?.value; if (!current || !newPw || !confirm) { Swal.showValidationMessage("All fields are required"); return false; } if (newPw !== confirm) { Swal.showValidationMessage("Passwords do not match"); return false; } return true; } }).then((result) => { if (result.isConfirmed) { Swal.fire({ title: "Updated!", text: "Your password has been changed.", icon: "success", timer: 1500, showConfirmButton: false, background: "#1a1040", color: "#fff" }); } })}>
                  <BsKey size={14} className="me-1" /> Change
                </button>
              </div>
              <div className={styles.securityOption}>
                <div>
                  <p className={styles.securityLabel}>Two-Factor Authentication</p>
                  <p className={styles.securityHint}>Add an extra layer of security to your account</p>
                </div>
                <button className={styles.changeBtn} onClick={() => Swal.fire({ title: "2FA Setup", text: "Two-factor authentication setup coming soon.", icon: "info", confirmButtonColor: "#7C3AED", background: "#1a1040", color: "#fff" })}>Enable</button>
              </div>
              <div className={styles.dangerZone}>
                <h5 className={styles.dangerTitle}><BsExclamationTriangle size={18} />Danger Zone</h5>
                <p className={styles.dangerDesc}>Once you delete your account, there is no going back.</p>
                <button className={styles.deleteBtn} onClick={handleDeleteAccount}><BsTrash3 size={16} />Delete Account</button>
              </div>
            </div>
          )}

          {/* Connected Accounts */}
          {activeTab === "accounts" && (
            <div className={styles.settingsPanel}>
              <div className={styles.panelHeader}>
                <div>
                  <h3 className={styles.panelTitle}><BsLink45Deg size={20} />Connected Accounts</h3>
                  <p className={styles.panelSubtitle}>Link or unlink external accounts to enhance your portfolio.</p>
                </div>
              </div>
              {accounts.map((account) => (
                <div key={account.id} className={styles.connectedAccount}>
                  <div className={styles.accountIcon} style={{ background: account.bgColor, color: account.iconColor }}>{account.icon}</div>
                  <div className={styles.accountInfo}>
                    <p className={styles.accountName}>{account.name}</p>
                    <p className={`${styles.accountStatus} ${account.connected ? styles.connected : styles.disconnected}`}>{account.connected ? "Connected" : "Not connected"}</p>
                  </div>
                  <button className={`${styles.connectBtn} ${account.connected ? styles.connected : styles.disconnected}`} onClick={() => toggleAccount(account.id)}>{account.connected ? "Disconnect" : "Connect"}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;