const MembersList = ({ members, owner }) => {

     if (!members || members.length === 0) {
        return <p>No members found</p>;
    }
    
    return (
        <div className="members-container">

            <h2 className="members-title">
                Team Members
            </h2>

            {members.map((member) => (

                <div
                    key={member.user._id}
                    className="member-card"
                >

                <div className="member-left">

                    <div className="avatar">
                        {member?.user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>   
                        <h4>{member.user?.name}</h4>
                        <p>{member.user?.email}</p>
                    </div>

                    </div>

                    <span className={`role-badge ${member.role}`}>
                        {member.role}
                    </span>

                </div>
            ))}

        </div>
    );
};

export default MembersList;