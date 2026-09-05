import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../dashboard/SideBar";
import toast from "react-hot-toast";
import { ShieldCheck, CheckCircle2, XCircle, Clock, Loader2, Stethoscope } from "lucide-react";
import SideBar from "../dashboard/SideBar";

export default function AccessRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/patient/access-requests");
      setRequests(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch access requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/patient/access-requests/${id}/approve`);
      toast.success("Access request approved successfully!");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not approve request");
    }
  };

  const handleDeny = async (id) => {
    try {
      await api.patch(`/patient/access-requests/${id}/deny`);
      toast.success("Access request denied");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not deny request");
    }
  };

  return (
<div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex flex-col md:flex-row gap-3 max-w-9xl mx-auto">        <SideBar />

<div className="flex-1 md:ml-64 h-full flex flex-col p-2">          {/* Header */}
          <div className="bg-white rounded p-6 shadow-sm border border-gray-100 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Shared Access Requests
                </h1>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Manage doctor permissions to view your medical records & history
              </p>
            </div>

            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto border border-blue-100">
              Total: {requests.length}
            </div>
          </div>

          {/* Requests List */}
          <div className="flex-1 hide-scrollbar overflow-y-auto mt-2">
          {loading ? (
            <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Loading access requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-gray-800">No Access Requests Yet</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                When doctors request access to view your medical history, their requests will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200/80"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Stethoscope className="w-6 h-6" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Dr. {req.doctor?.name.split(" ")
                       .map(
                         (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                        </h3>

                        <p className="text-sm text-blue-600 font-semibold mt-0.5">
                          {req.doctor?.specialization.split(" ")
                       .map(
                         (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Requested on: {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          req.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : req.status === "denied"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {req.status === "approved" ? (
                          <CheckCircle2 size={14} />
                        ) : req.status === "denied" ? (
                          <XCircle size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                        <span>{req.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions for Pending Requests */}
                  {req.status === "pending" && (
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                      >
                        <CheckCircle2 size={16} />
                        <span>Approve Access</span>
                      </button>

                      <button
                        onClick={() => handleDeny(req.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
                      >
                        <XCircle size={16} />
                        <span>Deny Access</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}