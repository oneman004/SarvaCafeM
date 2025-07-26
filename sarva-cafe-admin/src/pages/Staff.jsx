import React, { useState } from "react";

// Dummy initial staff data
const initialStaffData = [
  {
    id: 1,
    name: "Amit Verma",
    dob: "1990-05-12",
    mobile: "9876543210",
    kycDocuments: ["Aadhar.pdf", "PAN.pdf"],
    disability: true,
    disabilityType: "Hearing Impairment",
    deviceIssues: "Smartwatch not syncing",
    deviceIMEI: "356789045612345",
    phoneIMEI: "868768123456789",
    role: "Waiter",
    skills: ["Table Service", "POS Handling", "Customer Support"],
  },
  {
    id: 2,
    name: "Riya Sharma",
    dob: "1995-02-28",
    mobile: "9123456789",
    kycDocuments: ["Aadhar.pdf"],
    disability: false,
    disabilityType: "",
    deviceIssues: "None",
    deviceIMEI: "456123789045612",
    phoneIMEI: "968768123456789",
    role: "Chef",
    skills: ["Cooking", "Menu Planning", "Hygiene Management"],
  },
];

export default function Staff() {
  const [staffData, setStaffData] = useState(initialStaffData);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    dob: "",
    mobile: "",
    kycDocuments: "",
    disability: false,
    disabilityType: "",
    deviceIssues: "",
    deviceIMEI: "",
    phoneIMEI: "",
    role: "",
    skills: "",
  });

  // Filtering
  const filteredStaff = staffData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole ? s.role === filterRole : true;
    const matchesSkill = filterSkill
      ? s.skills.some((sk) =>
          sk.toLowerCase().includes(filterSkill.toLowerCase())
        )
      : true;
    return matchesSearch && matchesRole && matchesSkill;
  });

  // Save staff (add or edit)
  const handleSaveStaff = () => {
    if (isEditing) {
      setStaffData((prev) =>
        prev.map((s) =>
          s.id === selectedStaff.id
            ? {
                ...selectedStaff,
                ...newStaff,
                kycDocuments: newStaff.kycDocuments
                  .split(",")
                  .map((d) => d.trim()),
                skills: newStaff.skills.split(",").map((d) => d.trim()),
                disability:
                  newStaff.disability === "true" || newStaff.disability === true,
              }
            : s
        )
      );
    } else {
      const nextId =
        staffData.length > 0 ? Math.max(...staffData.map((s) => s.id)) + 1 : 1;
      setStaffData((prev) => [
        ...prev,
        {
          ...newStaff,
          id: nextId,
          kycDocuments: newStaff.kycDocuments
            .split(",")
            .map((d) => d.trim()),
          skills: newStaff.skills.split(",").map((d) => d.trim()),
          disability:
            newStaff.disability === "true" || newStaff.disability === true,
        },
      ]);
    }
    setSelectedStaff(null);
    setNewStaff({
      name: "",
      dob: "",
      mobile: "",
      kycDocuments: "",
      disability: false,
      disabilityType: "",
      deviceIssues: "",
      deviceIMEI: "",
      phoneIMEI: "",
      role: "",
      skills: "",
    });
    setIsEditing(false);
  };

  // ✅ Delete with confirmation
  const handleDeleteStaff = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (confirmed) {
      setStaffData((prev) => prev.filter((s) => s.id !== id));
      setSelectedStaff(null);
    }
  };

  // open modal
  const openModal = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(false);
    setNewStaff({
      ...staff,
      kycDocuments: staff.kycDocuments.join(", "),
      skills: staff.skills.join(", "),
    });
  };

  // open modal for adding
  const openAddModal = () => {
    setSelectedStaff({});
    setNewStaff({
      name: "",
      dob: "",
      mobile: "",
      kycDocuments: "",
      disability: false,
      disabilityType: "",
      deviceIssues: "",
      deviceIMEI: "",
      phoneIMEI: "",
      role: "",
      skills: "",
    });
    setIsEditing(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Staff</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-3 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 rounded-md border border-gray-300 w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 rounded-md border border-gray-300"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Waiter">Waiter</option>
          <option value="Chef">Chef</option>
        </select>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          ➕ Add Staff
        </button>
      </div>

      {/* Staff cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            onClick={() => openModal(staff)}
            className="cursor-pointer bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-lg font-bold mb-3">
              {staff.name.charAt(0)}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{staff.name}</h2>
            <p className="text-sm text-gray-500">{staff.role}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedStaff !== null && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedStaff(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>

            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {selectedStaff.name}
                </h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>DOB:</strong> {selectedStaff.dob}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {selectedStaff.mobile}
                  </p>
                  <p>
                    <strong>Role:</strong> {selectedStaff.role}
                  </p>
                  <p>
                    <strong>KYC:</strong>{" "}
                    {selectedStaff.kycDocuments.join(", ")}
                  </p>
                  <p>
                    <strong>Disabilities:</strong>{" "}
                    {selectedStaff.disability
                      ? `Yes (${selectedStaff.disabilityType})`
                      : "None"}
                  </p>
                  <p>
                    <strong>Device Issues:</strong> {selectedStaff.deviceIssues}
                  </p>
                  <p>
                    <strong>Device IMEI:</strong> {selectedStaff.deviceIMEI}
                  </p>
                  <p>
                    <strong>Phone IMEI:</strong> {selectedStaff.phoneIMEI}
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {selectedStaff.skills.join(", ")}
                  </p>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteStaff(selectedStaff.id, selectedStaff.name)
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    🗑 Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {selectedStaff?.id ? "Edit Staff" : "Add Staff"}
                </h2>
                <div className="space-y-3">
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Name"
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="p-2 border rounded-md w-full"
                    value={newStaff.dob}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, dob: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Mobile"
                    value={newStaff.mobile}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, mobile: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="KYC Documents (comma separated)"
                    value={newStaff.kycDocuments}
                    onChange={(e) =>
                      setNewStaff({
                        ...newStaff,
                        kycDocuments: e.target.value,
                      })
                    }
                  />
                  <select
                    className="p-2 border rounded-md w-full"
                    value={newStaff.disability}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, disability: e.target.value })
                    }
                  >
                    <option value={false}>No Disability</option>
                    <option value={true}>Has Disability</option>
                  </select>
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Type of Disability"
                    value={newStaff.disabilityType}
                    onChange={(e) =>
                      setNewStaff({
                        ...newStaff,
                        disabilityType: e.target.value,
                      })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Device Issues"
                    value={newStaff.deviceIssues}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, deviceIssues: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Device IMEI"
                    value={newStaff.deviceIMEI}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, deviceIMEI: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Phone IMEI"
                    value={newStaff.phoneIMEI}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phoneIMEI: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Role"
                    value={newStaff.role}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, role: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md w-full"
                    placeholder="Skills (comma separated)"
                    value={newStaff.skills}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, skills: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleSaveStaff}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  💾 Save
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
