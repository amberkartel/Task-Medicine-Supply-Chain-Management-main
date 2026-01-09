import { Web3Provider } from "./context/Web3Provider";

function App() {
  return (
    <Web3Provider>
      <Router>
        <BackendStatusModal />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-medicine" element={<AddMedicine />} />
          <Route path="/medicines" element={<MedicineList />} />
          <Route path="/medicine-details" element={<Medicine />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/shipments" element={<Shipments />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
