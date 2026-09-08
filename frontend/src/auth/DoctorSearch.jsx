import { useEffect, useState } from "react";
import api from "../api/axios";
import Select from "react-select";

export function DoctorSearch({ onSelect, searchType = "doctors", defaultValue = null }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [scheduledAt, setScheduledAt] = useState(""); 

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (value) => {
    const res = await api.get(`/search/${searchType}`);
    setResults(res.data.data || []);
  };

  const doctorOptions = results.map((doc) => ({
    value: doc.id,
    label: doc.name,
    specialization: doc.specialization,
    experience: doc.experience,
    consultationFee: doc.consultationFee,
  }));

  const hospitalOptions = results.map((doc) => ({
    value: doc.id,
    label: doc.name,
    type: doc.type,
    city: doc.city,
  }));

  useEffect(() => {
    if (defaultValue && results.length > 0) {
      const defaultId = typeof defaultValue === "object" ? defaultValue.id : defaultValue;
      if (searchType === "hospitals") {
        const found = hospitalOptions.find((h) => h.value === defaultId);
        if (found) setSelectedHospitalId(found);
      } else {
        const found = doctorOptions.find((d) => d.value === defaultId);
        if (found) setSelectedDoctorId(found);
      }
    }
  }, [defaultValue, results]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "45px",
      height: "45px",
      borderRadius: "10px",
    }),

    valueContainer: (provided) => ({
      ...provided,
      height: "45px",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
    }),

    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (provided) => ({
      ...provided,
      height: "40px",
    }),

    singleValue: (provided) => ({
      ...provided,
      margin: 0,
    }),
  };

  const customStylesforHospitals = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      height: "40px",
      borderRadius: "10px",
    }),

    valueContainer: (provided) => ({
      ...provided,
      height: "40px",
      display: "flex",
      alignItems: "center",
      padding: "0 10px",
    }),

    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (provided) => ({
      ...provided,
      height: "40px",
    }),

    singleValue: (provided) => ({
      ...provided,
      margin: 0,
    }),
  };

  const CustomOptionforDoctors = ({ innerRef, innerProps, data }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer"
    >
      <div>
        <p className="font-semibold">
          {data.label
            ? data.label
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : ""}
        </p>

        {data.specialization && (
          <p className="text-sm text-gray-500">
            {data.specialization
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
        )}
        <div className="flex gap-9 ">
          <p className="text-xs text-blue-600">
            {data.experience} Years Experience
          </p>
          <p className="text-xs flex text-blue-600">
            Fees : ₹{data.consultationFee}
          </p>
        </div>
      </div>
    </div>
  );

  const CustomOptionforHospitals = ({ innerRef, innerProps, data }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer"
    >
      <div>
        <p className="font-semibold">
          {data.label
            ? data.label
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : ""}
        </p>

        <div className="flex items-center gap-4">
          {data.type && (
            <p className="text-sm text-gray-500">
              {data.type
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
          )}
          {data.city && (
            <p className="text-xs text-blue-600">
              City : {data.city}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <span className="font-medium text-gray-800">{data.label}</span>
  );

  const handleClose = () => {
    setScheduledAt("");
    setSelectedDoctorId(null);
    setShowAppointment(false);
  };

  return (
    <div>
      {searchType === "hospitals" ? (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hospital (optional — leave blank if independent)
          </label>
          <Select
            isSearchable={true}
            isClearable={true}
            styles={customStylesforHospitals}
            options={hospitalOptions}
            value={selectedHospitalId}
            onChange={(hospital) => {
              setSelectedHospitalId(hospital);
              onSelect(hospital);
            }}
            placeholder="Select hospital"
            components={{
              Option: CustomOptionforHospitals,
              SingleValue: CustomSingleValue,
            }}
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Doctor
          </label>
          <Select
            isSearchable={true}
            isClearable={true}
            styles={customStyles}
            options={doctorOptions}
            value={selectedDoctorId}
            onChange={(option) => {
              setSelectedDoctorId(option);
              onSelect(option);
            }}
            placeholder="Select Doctor"
            components={{
              Option: CustomOptionforDoctors,
              SingleValue: CustomSingleValue,
            }}
          />
        </div>
      )}
    </div>
  );
}
