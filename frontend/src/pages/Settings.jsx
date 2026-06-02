import AddMember from "../components/workspace/AddMember";

const Settings = () => {
  return (
    <div className="settings-page">
      <h2 className="page-title">Settings</h2>

      <div className="settings-grid">
        <AddMember />

        <div className="settings-card">
          <h3>Workspace Settings</h3>
          <p>Manage workspace preferences here</p>
        </div>

        <div className="settings-card">
          <h3>Danger Zone</h3>
          <p>Delete workspace or reset data</p>
          <button className="btn-danger">Delete Workspace</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;