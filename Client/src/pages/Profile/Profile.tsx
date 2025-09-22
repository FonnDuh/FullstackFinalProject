import { type FunctionComponent, useMemo } from "react";
// import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Profile.css";

const Profile: FunctionComponent<object> = () => {
  const { user } = useAuth();

  const capitalize = (str: string) => {
    return str ? str[0].toUpperCase() + str.slice(1) : "";
  };

  const fullName = useMemo(() => {
    if (user?.name) {
      const first = capitalize(user.name.first || ""),
        last = capitalize(user.name.last || "");
      return `${first} ${last}`.trim();
    }
    return "No name provided";
  }, [user]);

  const formattedCreatedAt = useMemo(() => {
    if (user) {
      return new Date(user.createdAt || "No Date Found").toLocaleString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
      );
    }
    return "No Date Found";
  }, [user]);

  if (!user) {
    return (
      <>
        <div className="noUser">No User Found</div>
      </>
    );
  }

  return (
    <div className="profileWrapper">
      <h1 className="title">User Profile</h1>
      <div className="profileCard" style={{ maxWidth: "750px" }}>
        <div className="cardHeader">
          <h2>{user.username}</h2>
        </div>
        <div className="cardBody">
          <img
            src={user.image_url || "https://via.placeholder.com/150"}
            alt="Profile Image"
            className="profileImg"
            aria-label="User Profile Image"
          />
          <p>
            <strong>Full Name:</strong> {fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Date of birth:</strong> {user.dateOfBirth}
          </p>
          <p>
            <strong>Account Type:</strong> {user.isAdmin ? "Admin" : "Watcher"}
          </p>
          <p>
            <strong>User Created At:</strong> {formattedCreatedAt}
          </p>
          <p>
            <strong>User Id:</strong> {user._id}
          </p>
        </div>
      </div>
      {/* <Link
        className="editBtn"
        to={`/profile/${user._id}/edit`}
        aria-label="Edit Profile">
        Edit
      </Link> */}
    </div>
  );
};

export default Profile;
