import { useState, useContext } from "react";
import { Web3Context } from "../context/Web3Provider";
import { CheckCircle, AlertTriangle, Pill, Info, Clipboard } from "lucide-react";

const AddMedicine = () => {
  const { contract, account } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stage: "Ordered",
  });

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      setNotification({ show: true, type: "error", message: "Connect your wallet first!" });
      return;
    }

    setLoading(true);
    try {
      await contract.methods
        .addMedicine(formData.name, formData.description, formData.stage)
        .send({ from: account });

      setFormData({ name: "", description: "", stage: "Ordered" });
      setNotification({ show: true, type: "success", message: `Medicine "${formData.name}" added on blockchain!` });
    } catch (error) {
      console.error(error);
      setNotification({ show: true, type: "error", message: "Error adding medicine on blockchain" });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex items-center">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4">
              <Pill className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-white">Add Medicine</h2>
          </div>

          <div className="p-6 sm:p-8">
            {notification.show && (
              <div className={`mb-6 p-4 rounded-lg flex items-start ${notification.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {notification.type === "success" ? <CheckCircle className="h-5 w-5 mr-2 mt-0.5" /> : <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />}
                <span>{notification.message}</span>
              </div>
            )}

            <form onSubmit={handleAddMedicine} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-400">Medicine Name</label>
                <input type="text" placeholder="Enter medicine name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-400">Description</label>
                <textarea placeholder="Enter medicine description" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows="3" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-400">Current Stage</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })} required>
                  <option value="Ordered">Ordered</option>
                  <option value="RawMaterialSupplied">Raw Materials Supplied</option>
                  <option value="Manufactured">Manufactured</option>
                  <option value="Distributed">Distributed</option>
                  <option value="Retail">Retail</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center text-sm text-gray-600">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                <span>Adding medicine will create a new record on the blockchain.</span>
              </div>

              <button type="submit" className={`w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow hover:shadow-lg ${loading ? "opacity-75 cursor-not-allowed" : "hover:from-blue-700 hover:to-blue-600"} transition-all duration-300`} disabled={loading}>
                {loading ? <>Processing...</> : <>Add <Clipboard className="h-5 w-5 ml-2" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;
