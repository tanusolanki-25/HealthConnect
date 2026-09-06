import api from "../api/axios";
import Select from "react-select";

export function DoctorSearch({ onSelect, searchType = "doctors" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value) return setResults([]);
    const res = await api.get(`/search/${searchType}?search=${value}`);
    setResults(res.data.data);
  };

  const doctorOptions = doctors.map((doc) => ({
    value: doc.id,
    label: doc.name,
    specialization: doc.specialization,
    experience: doc.experience,
    consultationFee: doc.consultationFee,
  }));

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

  const CustomOption = ({ innerRef, innerProps, data }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer"
    >
      <div>
        <p className="font-semibold">
          {data.label
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </p>

        <p className="text-sm text-gray-500">
          {data.specialization
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </p>
        <div className="flex gap-9 ">
          <p className="text-xs text-blue-600">
            {data.experience} Years Experience
          </p>
          <p className="text-xs flex  text-blue-600 pl-58">
            Fees : ₹{data.consultationFee}
          </p>
        </div>
      </div>
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <span className="font-medium text-gray-800">{data.label}</span>
  );

  const handleClose = () => {
    setScheduledAt("");
    setSelectedDoctorId("");
    setShowAppointment(false);
  };

  return (
  <div>
   {searchType == "hospitals" ? (
    <div className="relative">
      <input
        placeholder={
          searchType === "doctors"
            ? "Search doctor by name"
            : "Search hospital by name"
        }
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {results.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            onSelect(item.id);
            setQuery(item.name);
            setResults([]);
          }}
        >
          {item.name}
        </div>
      ))}
      </div>
) :(
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Doctor
        </label>
        <Select
          isSearchable={false}
          styles={customStyles}
          options={doctorOptions}
          value={selectedDoctorId}
          onChange={(option) => setSelectedDoctorId(option)}
          placeholder="Select Doctor"
          components={{
            Option: CustomOption,
            SingleValue: CustomSingleValue,
          }}
        />
      </div>)
    }
  </div>
  );
}
