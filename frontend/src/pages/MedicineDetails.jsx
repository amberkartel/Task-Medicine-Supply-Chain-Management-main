import { useState, useEffect, useContext } from "react";
import { Web3Context } from "../context/Web3Provider";
import { FileSearch, Clock, Tag, History, ArrowRight, Loader, AlertCircle, CheckCircle } from "lucide-react";

const Medicine = () => {
  const { contract } = useContext(Web3Context);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medicineId, setMedicineId] = useState("");
  const [medicineHistory, setMedicineHistory] = useState([]);
  const [medicineStage, setMedicineStage] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [stageLoading, setStageLoading] = useState(false);

  useEffect(() => {
    const fetchAllMedicines = async () => {
      if (!contract) return;
      try {
        setLoading(true);
        const count = await contract.methods.getMedicineCount().call();
        const list = [];
        for (let i = 0; i < count; i++) {
          list.push(await contract.methods.medicines(i).call());
        }
        setMedicines(list);
      } catch (error) {
        console.error(error);
        setNotification({ show: true, type: "error", message: "Error fetching medicines" });
      } finally {
        setLoading(false);
      }
    };
    fetchAllMedicines();
  }, [contract]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
  };

  const handleGetHistory = async () => {
    if (!medicineId) return showNotification("error", "Enter a medicine ID");
    if (!contract) return;

    try {
      setHistoryLoading(true);
      const history = await contract.methods.getMedicineHistory(medicineId).call();
      setMedicineHistory(history);
      showNotification("success", "History retrieved from blockchain");
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGetStage = async () => {
    if (!medicineId) return showNotification("error", "Enter a medicine ID");
    if (!contract) return;

    try {
      setStageLoading(true);
      const stage = await contract.methods.getMedicineStage(medicineId).call();
      setMedicineStage(stage);
      showNotification("success", "Stage retrieved from blockchain");
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to fetch stage");
    } finally {
      setStageLoading(false);
    }
  };

  const getStageBadge = (stage) => {
    const colors = {
      Ordered: "bg-yellow-100 text-yellow-800",
      RawMaterialSupplied: "bg-blue-100 text-blue-800",
      Manufactured: "bg-purple-100 text-purple-800",
      Distributed: "bg-green-100 text-green-800",
      Retail: "bg-indigo-100 text-indigo-800",
      Sold: "bg-gray-100 text-gray-800",
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[stage] || "bg-gray-100 text-gray-800"}`}>{stage}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-800 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${notification.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {notification.type === "success" ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="mb-8 flex items-center">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-3 rounded-lg mr-4 shadow-md">
            <FileSearch className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Medicine Details</h2>
        </div>

        {/* Lookup */}
        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8 p-6 flex flex-col md:flex-row space-x-0 md:space-x-3 space-y-3 md:space-y-0">
          <input type="text" placeholder="Enter Medicine ID" className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500" value={medicineId} onChange={(e) => setMedicineId(e.target.value)} />
          <button onClick={handleGetHistory} className="bg-blue-600 px-4 py-3 rounded-lg text-white" disabled={historyLoading}>Get History</button>
          <button onClick={handleGetStage} className="bg-teal-600 px-4 py-3 rounded-lg text-white" disabled={stageLoading}>Get Stage</button>
        </div>

        {medicineStage && <div className="bg-gray-900 rounded-xl p-6 mb-8">Current Stage: {getStageBadge(medicineStage)}</div>}

        {medicineHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            {medicineHistory.map((h, idx) => (
              <div key={idx} className="p-4 border-b border-gray-200">{h.action} by {h.participant} at {new Date(h.timestamp * 1000).toLocaleString()}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medicine;
