import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  PlusCircle,
  Save,
  Download,
  HardHat,
  Factory,
  Wrench,
  History,
  User,
  X,
  Trash2,
  Lock,
  Settings,
  ChevronRight,
  ChevronDown,
  Monitor,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  CloudUpload,
  Database,
  FileSpreadsheet,
  RefreshCw,
  Layers,
  Calendar,
  ClipboardList,
  Share2,
  TrendingUp,
  Edit,
  Weight,
  Maximize2,
  Users,
  Unlock,
  Clock,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Eye,
  LogIn,
  Tablet,
  Laptop,
  ChevronsUpDown,
  Check,
  Menu,
  SaveAll,
  LayoutGrid,
  BarChart3,
  Wifi,
  WifiOff,
  CloudOff,
  Folder,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  getDocs,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadString,
} from "firebase/storage";

// --- Configurazione Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyCQ3VhCtvxIP2cxtdSgMzYXaTg4E1zPlZE",
  authDomain: "mora-app-36607.firebaseapp.com",
  projectId: "mora-app-36607",
  storageBucket: "mora-app-36607.firebasestorage.app",
  messagingSenderId: "1039836991600",
  appId: "1:1039836991600:web:dc33445a0cd54a9473e4b5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = "mora-maintenance-v1";

const ADMIN_PASSWORD = "Mora1932";

// --- HELPER ---
const getDeviceDetails = () => {
  const ua = navigator.userAgent;
  if (/iPad/i.test(ua) || (/Mac/i.test(ua) && "ontouchend" in document))
    return "iPad";
  if (/Tablet|Android/i.test(ua) && !/Mobile/i.test(ua))
    return "Tablet Android";
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/Android/i.test(ua)) return "Android Smartphone";
  if (/Win/i.test(ua)) return "PC Windows";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux PC";
  return "Dispositivo Web";
};

// --- COMPONENTI UI BASE ---

function NavButton({ icon: Icon, label, active, onClick, desktop = false }) {
  if (desktop) {
    return (
      <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all duration-200 ${
          active
            ? "bg-white text-blue-700 shadow-md"
            : "text-blue-100 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-1.5 group"
    >
      <div
        className={`p-2.5 rounded-2xl transition-all duration-200 ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-slate-400 group-hover:text-blue-500 group-hover:bg-slate-50"
        }`}
      >
        <Icon
          className={active ? "w-6 h-6" : "w-6 h-6"}
          strokeWidth={active ? 2.5 : 2}
        />
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-tight transition-colors ${
          active ? "text-blue-600" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function AdminTab({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
        active
          ? "bg-blue-700 text-white shadow-md"
          : "text-slate-400 hover:bg-slate-50"
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

// --- MODALI ---

function AdminLoginModal({ onSuccess, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const handleLogin = () => {
    if (pin === ADMIN_PASSWORD) onSuccess();
    else {
      setError(true);
      setPin("");
    }
  };
  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[150] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xs w-full p-10 space-y-8 animate-in zoom-in-95 border border-white/20">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            Accesso Admin
          </h3>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-3">
            Area Riservata
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="password"
            autoFocus
            className={`w-full p-5 bg-slate-50 border-4 rounded-2xl text-center text-3xl font-black tracking-[0.5em] outline-none transition-all ${
              error
                ? "border-red-500 animate-bounce bg-red-50"
                : "border-slate-100 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"
            }`}
            placeholder="••••"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 hover:-translate-y-0.5 transition-all"
          >
            Conferma
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({
  onConfirm,
  onCancel,
  pin,
  setPin,
  error,
  title,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-8 max-w-xs w-full text-center space-y-6 shadow-2xl">
        <Lock className="w-12 h-12 text-red-500 mx-auto" />
        <div className="space-y-2">
          <h4 className="font-black text-slate-800 uppercase text-sm">
            {title}
          </h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            PIN richiesto
          </p>
        </div>
        <input
          type="password"
          placeholder="••••"
          className={`w-full p-4 bg-slate-50 border-2 rounded-xl text-center text-2xl font-black outline-none transition-all ${
            error ? "border-red-500" : "border-slate-100 focus:border-blue-500"
          }`}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
          autoFocus
        />
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onConfirm}
            className="py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-red-200 active:scale-95 transition-all"
          >
            Elimina
          </button>
          <button
            onClick={onCancel}
            className="py-4 bg-slate-100 text-slate-400 rounded-xl font-black text-xs uppercase active:scale-95 transition-all"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

function EditLogModal({ log, customers, technicians, machineTypes, onClose }) {
  const [data, setData] = useState({ ...log });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "maintenance_logs",
          log.id
        ),
        {
          technician: data.technician,
          customer: data.customer,
          machineId: data.machineId.toUpperCase(),
          machineType: data.machineType,
          capacity: data.capacity,
          description: data.description,
          dateString: data.dateString,
        }
      );
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="font-black text-slate-600 uppercase tracking-widest text-xs">
            Modifica Rapporto
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Tecnico
              </label>
              <select
                className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
                value={data.technician}
                onChange={(e) =>
                  setData({ ...data, technician: e.target.value })
                }
              >
                {technicians.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Data (GG/MM/AAAA)
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
                value={data.dateString}
                onChange={(e) =>
                  setData({ ...data, dateString: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Cliente
            </label>
            <select
              className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
              value={data.customer}
              onChange={(e) => setData({ ...data, customer: e.target.value })}
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Matricola
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-black uppercase"
                value={data.machineId}
                onChange={(e) =>
                  setData({ ...data, machineId: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Tipo
              </label>
              <select
                className="w-full p-3 bg-slate-50 rounded-xl border text-xs font-bold"
                value={data.machineType}
                onChange={(e) =>
                  setData({ ...data, machineType: e.target.value })
                }
              >
                {machineTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Portata
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
                value={data.capacity || ""}
                onChange={(e) => setData({ ...data, capacity: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Descrizione
            </label>
            <textarea
              rows="4"
              className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-medium"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
        </div>
        <div className="p-6 border-t bg-slate-50">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
          >
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditMachineModal({ machine, customers, machineTypes, onClose }) {
  const [data, setData] = useState({ ...machine });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "machines",
          machine.id.toLowerCase()
        ),
        {
          id: machine.id, // Keep original ID case
          customerName: data.customerName,
          type: data.type,
          capacity: data.capacity,
        },
        { merge: true }
      );
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="font-black text-slate-600 uppercase tracking-widest text-xs">
            Modifica Gru: {machine.id}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Cliente
            </label>
            <select
              className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
              value={data.customerName}
              onChange={(e) =>
                setData({ ...data, customerName: e.target.value })
              }
            >
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Tipo
            </label>
            <select
              className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              {machineTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Portata
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-50 rounded-xl border text-sm font-bold"
              value={data.capacity || ""}
              onChange={(e) => setData({ ...data, capacity: e.target.value })}
              placeholder="Es. 1000kg"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest mt-4"
          >
            {loading ? "..." : "Salva Modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MachineHistoryModal({ machineId, machines, allLogs, onClose }) {
  const liveMachine = useMemo(() => {
    return (
      machines.find((m) => m.id.toLowerCase() === machineId.toLowerCase()) || {
        id: machineId,
        customerName: "...",
        type: "...",
        capacity: "...",
      }
    );
  }, [machines, machineId]);

  const machineLogs = useMemo(() => {
    return allLogs.filter((l) => l.machineId === liveMachine.id);
  }, [allLogs, liveMachine]);

  const [tab, setTab] = useState("history");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    if (!navigator.onLine) {
      alert(
        "L'upload di file non è disponibile offline. Torna online per caricare documenti."
      );
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `machines/${liveMachine.id}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "machines",
          liveMachine.id.toLowerCase()
        ),
        {
          attachments: arrayUnion({
            name: file.name,
            url: downloadURL,
            type: file.type,
            uploadedAt: Date.now(),
          }),
        }
      );
    } catch (err) {
      console.error("Upload failed", err);
      alert("Errore caricamento: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (att) => {
    if (!navigator.onLine) {
      alert("Operazione non disponibile offline.");
      return;
    }
    if (!window.confirm("Eliminare questo file?")) return;
    try {
      await updateDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "machines",
          liveMachine.id.toLowerCase()
        ),
        {
          attachments: arrayRemove(att),
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-50 w-full max-w-4xl h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-blue-700 p-6 flex flex-col gap-4 text-white shrink-0 relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-none">
                  {liveMachine.customerName || liveMachine.customer}
                </h2>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-blue-200 mt-2">
                  <span className="bg-white/20 px-2 py-1 rounded border border-white/10">
                    MAT: {liveMachine.id}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded border border-white/10">
                    TIPO: {liveMachine.type}
                  </span>
                  {liveMachine.capacity && (
                    <span className="bg-white/20 px-2 py-1 rounded border border-white/10">
                      PORTATA: {liveMachine.capacity}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setTab("history")}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                tab === "history"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-blue-800/50 text-blue-300 hover:bg-blue-800"
              }`}
            >
              Interventi ({machineLogs.length})
            </button>
            <button
              onClick={() => setTab("docs")}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                tab === "docs"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-blue-800/50 text-blue-300 hover:bg-blue-800"
              }`}
            >
              Documenti ({(liveMachine.attachments || []).length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {tab === "history" ? (
            <div className="space-y-6">
              {machineLogs.map((log, idx) => (
                <div key={log.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-100 mt-2 shrink-0"></div>
                    {idx !== machineLogs.length - 1 && (
                      <div className="w-0.5 bg-blue-200 flex-1 my-2"></div>
                    )}
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex-1 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-blue-600 font-black text-xs uppercase tracking-widest">
                        {log.dateString}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <User className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">
                          {log.technician}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      "{log.description}"
                    </p>
                  </div>
                </div>
              ))}
              {machineLogs.length === 0 && (
                <div className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest">
                  Nessun intervento registrato
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploading}
                  accept="image/*,application/pdf"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    {uploading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <CloudUpload className="w-6 h-6" />
                    )}
                  </div>
                  <span className="font-black text-xs uppercase text-slate-500 tracking-widest">
                    {uploading
                      ? "Caricamento in corso..."
                      : "Tocca per caricare foto o PDF"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(liveMachine.attachments || []).map((att, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 relative group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      {att.type?.includes("image") ? (
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {att.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(att.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteAttachment(att)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {(!liveMachine.attachments ||
                liveMachine.attachments.length === 0) && (
                <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">
                  Nessun documento allegato
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- VISTE PRINCIPALI ---

function DashboardView({ onNavigate }) {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => onNavigate("new")}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-4 group hover:scale-[1.02] transition-all hover:shadow-2xl hover:border-blue-200"
        >
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <PlusCircle className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
              Nuovo
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Inserisci Rapporto
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate("history")}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-4 group hover:scale-[1.02] transition-all hover:shadow-2xl hover:border-emerald-200"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
            <History className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1 group-hover:text-emerald-600 transition-colors">
              Storico
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Cerca Interventi
            </p>
          </div>
        </button>

        <a
          href="https://drive.google.com/drive/folders/1Q-eci-R03-T_ELVfQJaLP0ToH5Hzr-z9?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-4 group hover:scale-[1.02] transition-all hover:shadow-2xl hover:border-indigo-200"
        >
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <Folder className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">
              Clienti Drive
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Cartella Condivisa
            </p>
          </div>
        </a>

        <button
          onClick={() => onNavigate("admin")}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center gap-4 group hover:scale-[1.02] transition-all hover:shadow-2xl hover:border-slate-300"
        >
          <div className="w-20 h-20 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors duration-300">
            <Settings className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-1 group-hover:text-slate-700 transition-colors">
              Admin
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Gestione Dati
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function NewEntryForm({
  user,
  customers,
  technicians,
  machineTypes,
  machineMap,
  machines,
  onSuccess,
  isMobile,
  isOnline,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFilled, setAutoFilled] = useState({
    customer: false,
    type: false,
    capacity: false,
  });
  const [formData, setFormData] = useState({
    technician: "",
    customer: "",
    newCustomerName: "",
    machineType: "",
    machineId: "",
    capacity: "",
    description: "",
  });

  const [customerSearch, setCustomerSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedMachines, setRelatedMachines] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const savedTech = localStorage.getItem("mora_tech_last_name");
    if (savedTech) {
      setFormData((prev) => ({ ...prev, technician: savedTech }));
    }
  }, []);

  useEffect(() => {
    if (!formData.machineType && machineTypes.length > 0) {
      setFormData((prev) => ({ ...prev, machineType: machineTypes[0].name }));
    }
  }, [machineTypes]);

  useEffect(() => {
    if (formData.technician) {
      localStorage.setItem("mora_tech_last_name", formData.technician);
    }
  }, [formData.technician]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const resetMachineData = () => {
    setFormData((prev) => ({
      ...prev,
      customer: "",
      machineId: "",
      machineType: machineTypes.length > 0 ? machineTypes[0].name : "",
      capacity: "",
    }));
    setCustomerSearch("");
    setRelatedMachines([]);
    setAutoFilled({ customer: false, type: false, capacity: false });
  };

  const handleCustomerSearchChange = (e) => {
    const val = e.target.value;
    if (val.trim() === "") {
      resetMachineData();
      return;
    }
    setCustomerSearch(val);
    setFormData((prev) => ({ ...prev, customer: val }));

    if (val.length > 0) {
      setShowSuggestions(true);
      setRelatedMachines([]);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCustomer = (custName) => {
    setCustomerSearch(custName);
    setFormData((prev) => ({ ...prev, customer: custName }));
    setShowSuggestions(false);
    const custMachines = machines.filter(
      (m) => m.customerName.toLowerCase() === custName.toLowerCase()
    );
    setRelatedMachines(custMachines);
  };

  const selectMachine = (machine) => {
    setFormData((prev) => ({
      ...prev,
      machineId: machine.id,
      machineType: machine.type || "",
      capacity: machine.capacity || "",
    }));
    setAutoFilled({ customer: true, type: true, capacity: true });
  };

  const handleMachineIdChange = (e) => {
    const mId = e.target.value;
    if (mId.trim() === "") {
      resetMachineData();
      return;
    }
    const cleanId = mId.toLowerCase().trim();
    let updates = { machineId: mId };
    let newAutoFilled = { customer: false, type: false, capacity: false };

    if (cleanId && cleanId.length >= 2) {
      const knownData = machineMap[cleanId];
      if (knownData) {
        updates.customer = knownData.customer;
        updates.machineType = knownData.type || "";
        updates.capacity = knownData.capacity || "";
        setCustomerSearch(knownData.customer);
        newAutoFilled = { customer: true, type: true, capacity: true };
      }
    }
    setFormData((prev) => ({ ...prev, ...updates }));
    setAutoFilled(newAutoFilled);
  };

  const getFieldClass = (isAuto) => {
    const base =
      "w-full px-5 py-4 border-2 rounded-2xl font-bold text-sm outline-none transition-all duration-200 placeholder:text-slate-300";
    if (isAuto)
      return `${base} bg-emerald-50 border-emerald-300 text-emerald-800 focus:ring-4 focus:ring-emerald-100`;
    return `${base} bg-slate-50 border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-700`;
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCustomer = formData.customer;
    if (
      !formData.technician ||
      !finalCustomer ||
      !formData.description ||
      !formData.machineId
    )
      return;

    setIsSubmitting(true);
    const now = new Date();
    const mId = formData.machineId.toUpperCase().trim();
    const cleanMId = mId.toLowerCase();

    // Dati base dell'intervento
    const logData = {
      technician: formData.technician,
      customer: finalCustomer,
      machineType: formData.machineType,
      machineId: mId,
      capacity: formData.capacity,
      description: formData.description,
      userId: user.uid,
      dateString: now.toLocaleDateString("it-IT"),
      createdAt: isOnline ? serverTimestamp() : now.getTime(), // Timestamp statico per offline
    };

    if (!isOnline) {
      // LOGICA OFFLINE: Salva in localStorage
      try {
        const pendingLogs = JSON.parse(
          localStorage.getItem("mora_pending_logs") || "[]"
        );
        pendingLogs.push({ ...logData, type: "log" });
        localStorage.setItem("mora_pending_logs", JSON.stringify(pendingLogs));
        alert(
          "Rapporto salvato OFFLINE. Verrà inviato quando tornerai online."
        );
        onSuccess();
      } catch (err) {
        alert("Errore salvataggio offline: " + err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // LOGICA ONLINE
    try {
      await addDoc(
        collection(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "maintenance_logs"
        ),
        logData
      );

      const custId = finalCustomer.toLowerCase().replace(/\s+/g, "_");
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "customers", custId),
        {
          name: finalCustomer,
          lastUpdate: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "machines", cleanMId),
        {
          id: mId,
          customerName: finalCustomer,
          type: formData.machineType,
          capacity: formData.capacity,
        },
        { merge: true }
      );

      const techObj = technicians.find((t) => t.name === formData.technician);
      if (techObj) {
        try {
          await setDoc(
            doc(
              db,
              "artifacts",
              appId,
              "public",
              "data",
              "technicians",
              techObj.id
            ),
            {
              lastSeen: serverTimestamp(),
              lastDevice: getDeviceDetails(),
            },
            { merge: true }
          );
        } catch (e) {
          console.error("Tech update error", e);
        }
      }

      onSuccess();
    } catch (e) {
      console.error(e);
      alert(
        "Errore di connessione durante il salvataggio. Riprova più tardi o verifica la connessione."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="font-black text-slate-700 text-xs tracking-[0.2em] uppercase mb-1">
            Nuovo Intervento
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">
            Compila i dettagli del lavoro
          </p>
        </div>
        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
          <HardHat className="w-5 h-5" />
        </div>
      </div>
      {!isOnline && (
        <div className="bg-orange-50 px-8 py-3 border-b border-orange-100 flex items-center gap-3">
          <CloudOff className="w-5 h-5 text-orange-500" />
          <span className="text-[10px] font-bold text-orange-700 uppercase">
            Sei offline. Il rapporto verrà salvato in locale.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-8`}
        >
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">
              Tecnico
            </label>
            <div className="relative">
              <select
                required
                className={`${getFieldClass(false)} appearance-none`}
                value={formData.technician}
                onChange={(e) =>
                  setFormData({ ...formData, technician: e.target.value })
                }
              >
                <option value="">Seleziona...</option>
                {technicians.map((t, idx) => (
                  <option key={t.id} value={t.name}>
                    {idx < 3 ? "⭐ " : ""}
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                Matricola
              </label>
              <input
                type="text"
                required
                className={getFieldClass(autoFilled.customer)}
                value={formData.machineId}
                onChange={handleMachineIdChange}
                placeholder="Es. 12345"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">
                Tipo
              </label>
              <div className="relative">
                <select
                  className={`${getFieldClass(
                    autoFilled.type
                  )} appearance-none`}
                  value={formData.machineType}
                  onChange={(e) => {
                    setFormData({ ...formData, machineType: e.target.value });
                    setAutoFilled({ ...autoFilled, type: false });
                  }}
                >
                  {machineTypes.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 relative" ref={wrapperRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">
              Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                className={getFieldClass(autoFilled.customer)}
                placeholder="Cerca o inserisci nuovo..."
                value={customerSearch}
                onChange={handleCustomerSearchChange}
                onFocus={() => {
                  if (customerSearch) setShowSuggestions(true);
                }}
              />
              <div className="absolute right-4 top-4 text-slate-300">
                <Search className="w-4 h-4" />
              </div>

              {showSuggestions && filteredCustomers.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-200">
                  {filteredCustomers.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => selectCustomer(c.name)}
                      className="px-5 py-3 hover:bg-blue-50 cursor-pointer font-bold text-sm text-slate-700 uppercase flex justify-between items-center transition-colors"
                    >
                      {c.name}
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {relatedMachines.length > 0 && (
              <div className="mt-4 animate-in slide-in-from-top-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Parco Macchine {formData.customer}:
                </span>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar snap-x">
                  {relatedMachines.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => selectMachine(m)}
                      className={`flex-shrink-0 snap-start bg-white border-2 cursor-pointer rounded-2xl p-4 min-w-[150px] transition-all group shadow-sm hover:shadow-md ${
                        formData.machineId === m.id
                          ? "border-green-500 ring-2 ring-green-100"
                          : "border-slate-100 hover:border-blue-400"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`font-black text-xs ${
                            formData.machineId === m.id
                              ? "text-green-600"
                              : "text-blue-700"
                          }`}
                        >
                          {m.id}
                        </span>
                        {formData.machineId === m.id && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase leading-tight space-y-1">
                        <div>{m.type}</div>
                        <div className="text-slate-400 font-medium">
                          {m.capacity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">
              Portata
            </label>
            <input
              type="text"
              className={getFieldClass(autoFilled.capacity)}
              value={formData.capacity}
              onChange={(e) => {
                const val = e.target.value;
                if (val.trim() === "") {
                  resetMachineData();
                  return;
                }
                setFormData({ ...formData, capacity: val });
                setAutoFilled({ ...autoFilled, capacity: false });
              }}
              placeholder="Es. 5000kg"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-wider">
            Descrizione Lavoro
          </label>
          <textarea
            required
            rows="4"
            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all resize-none placeholder:text-slate-300"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Descrivi l'intervento effettuato..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 text-white rounded-2xl font-black text-sm shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none ${
            isOnline
              ? "bg-blue-700 hover:bg-blue-800"
              : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
          }`}
        >
          {isSubmitting
            ? "SALVATAGGIO IN CORSO..."
            : isOnline
            ? "SALVA RAPPORTO"
            : "SALVA IN LOCALE (OFFLINE)"}
        </button>
      </form>
    </div>
  );
}

function HistoryView({
  logs,
  machineMap,
  loading,
  isMobile,
  isAdmin,
  customers,
  technicians,
  machineTypes,
  machines,
  onAuthAdmin,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [viewingMachineHistory, setViewingMachineHistory] = useState(null);

  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [editActionType, setEditActionType] = useState(null);

  useEffect(() => {
    if (isAdmin && editActionType && isDeleting) {
      if (editActionType === "edit") {
        setIsEditing(isDeleting);
      }
      if (editActionType !== "delete") setIsDeleting(null);
      setEditActionType(null);
    }
  }, [isAdmin, editActionType, isDeleting]);

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return logs;
    const tokens = s.split(/\s+/);

    return logs.filter((l) => {
      const fullText =
        `${l.customer} ${l.machineId} ${l.description} ${l.technician}`.toLowerCase();
      return tokens.every((token) => fullText.includes(token));
    });
  }, [logs, searchTerm]);

  const matchedMachine = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return machineMap[s] ? { id: s.toUpperCase(), ...machineMap[s] } : null;
  }, [searchTerm, machineMap]);

  const matchedCustomersData = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    if (s.length < 1) return null;

    const tokens = s.split(/\s+/);
    const matchingCusts = customers.filter((c) => {
      const cName = c.name.toLowerCase();
      return tokens.every((token) => cName.includes(token));
    });

    if (matchingCusts.length === 0) return null;

    return matchingCusts.map((c) => {
      const custMachines = machines.filter((m) => m.customerName === c.name);
      return { ...c, machines: custMachines };
    });
  }, [searchTerm, customers, machines]);

  const isEditableFree = (log) => {
    if (!log.createdAt) return true;
    const created = log.createdAt.seconds
      ? log.createdAt.seconds * 1000
      : Date.now();
    return Date.now() - created < 3 * 60 * 1000;
  };

  const confirmDelete = async () => {
    try {
      if (pin === ADMIN_PASSWORD) {
        await deleteDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "maintenance_logs",
            isDeleting
          )
        );
        setIsDeleting(null);
        setPin("");
        setErr(false);
      } else {
        setErr(true);
      }
    } catch (e) {
      console.error(e);
      alert("Errore durante l'eliminazione");
    }
  };

  const handleEditClick = (log) => {
    if (isAdmin || isEditableFree(log)) {
      setIsEditing(log.id);
    } else {
      setEditActionType("edit");
      setIsDeleting(log.id);
      onAuthAdmin();
    }
  };

  const handleDeleteClick = (log) => {
    if (isAdmin) {
      setIsDeleting(log.id);
    } else {
      setEditActionType("delete");
      setIsDeleting(log.id);
      onAuthAdmin();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-32">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <div className="absolute left-5 top-4 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Cerca cliente o matricola..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {matchedMachine && (
        <div
          onClick={() => setViewingMachineHistory(matchedMachine)}
          className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform active:scale-95 group"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                Gru Trovata
              </span>
              <Maximize2 className="w-4 h-4 text-blue-100 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">
              {matchedMachine.customer}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                MAT: {matchedMachine.id}
              </span>
              <span className="bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                {matchedMachine.type}
              </span>
              {matchedMachine.capacity && (
                <span className="bg-white/20 px-4 py-2 rounded-xl border border-white/10">
                  {matchedMachine.capacity}
                </span>
              )}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">
              <ClipboardList className="w-4 h-4" />
              Apri Scheda
            </div>
          </div>
          <Factory className="w-48 h-48 text-white/5 absolute -right-8 -bottom-10 transition-transform group-hover:rotate-6 duration-500" />
        </div>
      )}

      {matchedCustomersData &&
        matchedCustomersData.map((cust) => (
          <div
            key={cust.id}
            className="bg-slate-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden mb-6"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                  Cliente Trovato
                </span>
                <Users className="w-4 h-4 text-slate-300 opacity-70" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6">
                {cust.name}
              </h3>

              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
                <span className="text-[10px] font-bold uppercase text-slate-400 mb-3 block tracking-widest">
                  Parco Macchine ({cust.machines.length})
                </span>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar-purple">
                  {cust.machines.map((m) => (
                    <button
                      key={m.id}
                      onClick={() =>
                        setViewingMachineHistory({ ...m, customer: cust.name })
                      }
                      className="text-left bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all flex justify-between items-center group border border-white/5 hover:border-white/20"
                    >
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase text-white tracking-wide">
                          Mat: {m.id}
                        </span>
                        <div className="text-[11px] text-slate-400 flex gap-2 mt-0.5 font-medium">
                          <span>{m.type}</span>
                          {m.capacity && (
                            <span className="text-white/40">
                              • {m.capacity}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                  {cust.machines.length === 0 && (
                    <span className="text-sm text-slate-400 italic p-2 block">
                      Nessuna gru registrata.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Factory className="w-56 h-56 text-white/5 absolute -right-10 -top-10 rotate-12" />
          </div>
        ))}

      {/* LISTA RAPPORTI */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        {isMobile ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-black text-slate-800 text-base uppercase leading-tight">
                      {log.customer}
                    </h4>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight bg-blue-50 px-2 py-1 rounded-lg self-start border border-blue-100">
                      Mat: {log.machineId} • {log.machineType || "-"} •{" "}
                      {log.capacity || "-"}
                      {log.capacity ? " kg" : ""}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-lg">
                      {log.dateString}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(log)}
                        className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                      >
                        {isEditableFree(log) ? (
                          <Edit className="w-4 h-4" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(log)}
                        className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-3">
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    "{log.description}"
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                      <User className="w-3 h-3" />
                    </div>
                    {log.technician}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">
                    Data
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[20%]">
                    Cliente
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                    Matricola
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-auto">
                    Lavoro
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">
                    Portata
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">
                    Tecnico
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {log.dateString}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-snug block break-words">
                        {log.customer}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 uppercase w-fit tracking-wide">
                          {log.machineId}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase pl-1">
                          {log.machineType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group-hover:shadow-md transition-all group-hover:border-blue-200">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap break-words">
                          {log.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">
                        {log.capacity ? `${log.capacity} kg` : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 border-2 border-white shadow-sm shrink-0">
                          {log.technician.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase truncate">
                          {log.technician}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(log)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-300 shadow-sm hover:shadow transition-all"
                        >
                          {isEditableFree(log) ? (
                            <Edit className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(log)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-300 shadow-sm hover:shadow transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-6 opacity-50">
            <div className="p-8 bg-slate-50 rounded-full text-slate-300">
              <ClipboardList className="w-16 h-16" />
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em]">
              Nessun rapporto trovato
            </p>
          </div>
        )}
      </div>

      {isDeleting && !isEditing && !editActionType && (
        <DeleteConfirmDialog
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleting(null);
            setPin("");
            setErr(false);
          }}
          pin={pin}
          setPin={setPin}
          error={err}
          title="Elimina Rapporto"
        />
      )}

      {isEditing && (
        <EditLogModal
          log={logs.find((l) => l.id === isEditing)}
          customers={customers}
          technicians={technicians}
          machineTypes={machineTypes}
          onClose={() => setIsEditing(null)}
        />
      )}

      {/* Modale Dettaglio Completo Macchina */}
      {viewingMachineHistory && (
        <MachineHistoryModal
          machineId={viewingMachineHistory.id}
          machines={machines}
          allLogs={logs}
          onClose={() => setViewingMachineHistory(null)}
        />
      )}
    </div>
  );
}

function AdminPanel({
  logs,
  customers,
  technicians,
  machines,
  machineTypes,
  isMobile,
}) {
  const [view, setView] = useState("techs");
  const [inputValue, setInputValue] = useState("");

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deletePin, setDeletePin] = useState("");
  const [deleteError, setDeleteError] = useState(false);

  const [machineToEdit, setMachineToEdit] = useState(null); // Per modificare anagrafica macchina

  // Stato per i log accessi
  const [accessLogs, setAccessLogs] = useState([]);

  useEffect(() => {
    if (view === "access_logs") {
      const q = query(
        collection(db, "artifacts", appId, "public", "data", "access_logs")
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const fetchedLogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Ordina per data decrescente
        fetchedLogs.sort(
          (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );
        setAccessLogs(fetchedLogs);
      });
      return () => unsub();
    }
  }, [view]);

  const addItem = async () => {
    if (!inputValue.trim()) return;
    const id = inputValue.toLowerCase().trim().replace(/\s+/g, "_");
    let collectionName = "";

    if (view === "techs") collectionName = "technicians";
    else if (view === "types") collectionName = "machine_types";

    if (collectionName) {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", collectionName, id),
        { name: inputValue.trim() }
      );
      setInputValue("");
    }
  };

  const startDeleteItem = (coll, id) => {
    setItemToDelete({ coll, id });
  };

  const confirmDeleteItem = async () => {
    if (deletePin === ADMIN_PASSWORD) {
      await deleteDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          itemToDelete.coll,
          itemToDelete.id
        )
      );
      setItemToDelete(null);
      setDeletePin("");
      setDeleteError(false);
    } else {
      setDeleteError(true);
    }
  };

  const clearAccessLogs = async () => {
    if (
      !window.confirm(
        "Sei sicuro di voler cancellare TUTTO lo storico accessi? Questa azione non è reversibile."
      )
    )
      return;

    try {
      const q = query(
        collection(db, "artifacts", appId, "public", "data", "access_logs")
      );
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (e) {
      console.error("Errore cancellazione log:", e);
      alert("Errore durante la cancellazione.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto gap-2 no-scrollbar">
        <AdminTab
          active={view === "techs"}
          onClick={() => setView("techs")}
          icon={User}
          label="Staff"
        />
        <AdminTab
          active={view === "types"}
          onClick={() => setView("types")}
          icon={Layers}
          label="Tipi Macchine"
        />
        <AdminTab
          active={view === "clients"}
          onClick={() => setView("clients")}
          icon={Factory}
          label="Anagrafica"
        />
        <AdminTab
          active={view === "access_logs"}
          onClick={() => setView("access_logs")}
          icon={LogIn}
          label="Accessi"
        />
      </div>

      {(view === "techs" || view === "types") && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase px-1 tracking-widest">
              {view === "techs" ? "Aggiungi Tecnico" : "Aggiungi Tipo Macchina"}
            </h4>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 p-4 bg-slate-50 border rounded-xl font-bold outline-none focus:border-blue-500"
                placeholder={
                  view === "techs" ? "Nome Tecnico..." : "Nome Macchina..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                onClick={addItem}
                className="px-6 bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-800 transition-all"
              >
                <PlusCircle />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(view === "techs" ? technicians : machineTypes).map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-blue-200 transition-all"
              >
                <span className="font-black text-slate-700 uppercase text-xs tracking-tight">
                  {item.name}
                </span>
                <button
                  onClick={() =>
                    startDeleteItem(
                      view === "techs" ? "technicians" : "machine_types",
                      item.id
                    )
                  }
                  className="p-2 text-slate-200 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "clients" && (
        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-8`}
        >
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase px-1 tracking-widest">
              Database Clienti
            </h4>
            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {customers.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:border-blue-400 transition-all group"
                >
                  <span className="font-black text-xs text-slate-700 uppercase truncate pr-4">
                    {c.name}
                  </span>
                  <button
                    onClick={() => startDeleteItem("customers", c.id)}
                    className="text-slate-200 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase px-1 tracking-widest">
              Database Matricole
            </h4>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 h-full overflow-y-auto max-h-[500px] space-y-3 shadow-inner bg-slate-50/50">
              {machines.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-blue-900 tracking-tighter uppercase">
                        {m.id}
                      </span>
                      <button
                        onClick={() => setMachineToEdit(m)}
                        className="p-1 text-slate-300 hover:text-blue-500"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase truncate max-w-[120px]">
                      {m.customerName}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-[7px] text-blue-400 font-bold uppercase">
                        {m.type}
                      </span>
                      {m.capacity && (
                        <span className="text-[7px] text-emerald-500 font-bold uppercase">
                          {m.capacity}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => startDeleteItem("machines", m.id)}
                    className="text-slate-200 hover:text-red-500 transition-all p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {machines.length === 0 && (
                <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Nessuna gru censita
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "access_logs" && (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
              Registro Accessi App
            </h3>
            {accessLogs.length > 0 && (
              <button
                onClick={clearAccessLogs}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Svuota Tutto
              </button>
            )}
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Data/Ora
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Tecnico
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Dispositivo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-xs font-bold text-slate-600">
                        {log.timestamp
                          ? new Date(
                              log.timestamp.seconds * 1000
                            ).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-6 py-3 text-xs font-black text-slate-800 uppercase">
                        {log.technician}
                      </td>
                      <td className="px-6 py-3 text-[10px] font-medium text-slate-500 flex items-center gap-2">
                        {log.device === "iPhone" && (
                          <Smartphone className="w-3 h-3 text-slate-400" />
                        )}
                        {log.device === "iPad" && (
                          <Tablet className="w-3 h-3 text-slate-400" />
                        )}
                        {log.device === "PC Windows" && (
                          <Laptop className="w-3 h-3 text-slate-400" />
                        )}
                        {log.device}
                      </td>
                    </tr>
                  ))}
                  {accessLogs.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-10 text-center text-xs text-slate-400 font-bold uppercase"
                      >
                        Nessun accesso registrato
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {itemToDelete && (
        <DeleteConfirmDialog
          title={
            itemToDelete.coll === "customers"
              ? "Elimina Cliente"
              : itemToDelete.coll === "machines"
              ? "Elimina Matricola"
              : "Elimina Elemento"
          }
          onConfirm={confirmDeleteItem}
          onCancel={() => {
            setItemToDelete(null);
            setDeletePin("");
            setDeleteError(false);
          }}
          pin={deletePin}
          setPin={setDeletePin}
          error={deleteError}
        />
      )}

      {machineToEdit && (
        <EditMachineModal
          machine={machineToEdit}
          customers={customers}
          machineTypes={machineTypes}
          onClose={() => setMachineToEdit(null)}
        />
      )}
    </div>
  );
}

// --- APP PRINCIPALE ---

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // Partenza dalla Dashboard
  const [logs, setLogs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [manualViewMode, setManualViewMode] = useState(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  useEffect(() => {
    if (!window.tailwind && !document.getElementById("tailwind-cdn")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // --- ONLINE/OFFLINE HANDLER ---
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check for pending data
    const pending = JSON.parse(
      localStorage.getItem("mora_pending_logs") || "[]"
    );
    if (pending.length > 0) {
      setPendingSyncCount(pending.length);
      if (navigator.onLine) {
        syncPendingData();
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncPendingData = async () => {
    const pendingLogs = JSON.parse(
      localStorage.getItem("mora_pending_logs") || "[]"
    );
    if (pendingLogs.length === 0) return;

    // Aggiorno UI
    setPendingSyncCount(pendingLogs.length);

    const newPending = [];
    for (const log of pendingLogs) {
      try {
        // Prepara i dati, rimuove il timestamp fittizio offline e mette quello del server
        const { type, createdAt, ...logData } = log;
        const dataToUpload = { ...logData, createdAt: serverTimestamp() };

        await addDoc(
          collection(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "maintenance_logs"
          ),
          dataToUpload
        );

        // Aggiorna anche le collection correlate (cliente, macchina, tecnico)
        // Nota: questo è un sync "best effort" per i dati correlati.
        const custId = logData.customer.toLowerCase().replace(/\s+/g, "_");
        const cleanMId = logData.machineId.toLowerCase();

        setDoc(
          doc(db, "artifacts", appId, "public", "data", "customers", custId),
          { name: logData.customer, lastUpdate: serverTimestamp() },
          { merge: true }
        );

        setDoc(
          doc(db, "artifacts", appId, "public", "data", "machines", cleanMId),
          {
            id: logData.machineId,
            customerName: logData.customer,
            type: logData.machineType,
            capacity: logData.capacity,
          },
          { merge: true }
        );

        // Decrementa conteggio visuale
        setPendingSyncCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error("Sync error for log", log, e);
        newPending.push(log); // Rimetti in coda se fallisce
      }
    }

    if (newPending.length > 0) {
      localStorage.setItem("mora_pending_logs", JSON.stringify(newPending));
      setPendingSyncCount(newPending.length);
    } else {
      localStorage.removeItem("mora_pending_logs");
      setPendingSyncCount(0);
      alert(
        "Sincronizzazione completata! I rapporti offline sono stati inviati."
      );
    }
  };

  const currentViewIsMobile = useMemo(() => {
    if (manualViewMode === "mobile") return true;
    if (manualViewMode === "desktop") return false;
    return isMobileView;
  }, [manualViewMode, isMobileView]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const doLogin = async () => {
          try {
            if (
              typeof __initial_auth_token !== "undefined" &&
              __initial_auth_token
            ) {
              await signInWithCustomToken(auth, __initial_auth_token);
            } else {
              await signInAnonymously(auth);
            }
          } catch (e) {
            console.error("Login error:", e);
          }
        };
        doLogin();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const logAccess = async () => {
      if (!isOnline) return; // Non loggare accessi se offline
      const savedTechName = localStorage.getItem("mora_tech_last_name");
      const sessionKey = `mora_access_logged_${new Date().toDateString()}`;
      if (savedTechName && !sessionStorage.getItem(sessionKey)) {
        try {
          await addDoc(
            collection(db, "artifacts", appId, "public", "data", "access_logs"),
            {
              technician: savedTechName,
              uid: user.uid,
              timestamp: serverTimestamp(),
              device: getDeviceDetails(),
              userAgent: navigator.userAgent,
            }
          );
          sessionStorage.setItem(sessionKey, "true");
        } catch (e) {
          console.error("Error logging access", e);
        }
      }
    };
    logAccess();
  }, [user, isOnline]);

  useEffect(() => {
    if (!user) return;
    // Solo se online attacchiamo i listener, altrimenti usiamo cache (non implementata fully qui, l'app richiede online per leggere storico aggiornato)
    if (!isOnline) {
      setLoading(false);
      return;
    }

    const unsubLogs = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "maintenance_logs"),
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        fetched.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setLogs(fetched);
        setLoading(false);
      }
    );
    const unsubCustomers = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "customers"),
      (snapshot) => {
        setCustomers(
          snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      }
    );
    const unsubTechs = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "technicians"),
      (snapshot) => {
        setTechnicians(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
    const unsubMachines = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "machines"),
      (snapshot) => {
        setMachines(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
    const unsubTypes = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "machine_types"),
      (snapshot) => {
        const types = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (types.length === 0) {
          setMachineTypes([
            { id: "carroponte", name: "Carroponte" },
            { id: "gru_bandiera", name: "Gru Bandiera" },
          ]);
        } else {
          setMachineTypes(types.sort((a, b) => a.name.localeCompare(b.name)));
        }
      }
    );
    return () => {
      unsubLogs();
      unsubCustomers();
      unsubTechs();
      unsubMachines();
      unsubTypes();
    };
  }, [user, isOnline]);

  const sortedTechnicians = useMemo(() => {
    const counts = {};
    logs.forEach((log) => {
      counts[log.technician] = (counts[log.technician] || 0) + 1;
    });
    return [...technicians].sort((a, b) => {
      const countA = counts[a.name] || 0;
      const countB = counts[b.name] || 0;
      if (countB !== countA) return countB - countA;
      return a.name.localeCompare(b.name);
    });
  }, [technicians, logs]);

  const machineMap = useMemo(() => {
    const map = {};
    machines.forEach((m) => {
      if (m.id)
        map[m.id.toLowerCase().trim()] = {
          customer: m.customerName,
          type: m.type,
          capacity: m.capacity || "",
        };
    });
    return map;
  }, [machines]);

  const handleTabChange = (tab) => {
    if (tab === "admin" && !isAdminAuthenticated) {
      setPendingTab("admin");
      setShowAdminLogin(true);
    } else {
      setActiveTab(tab);
    }
  };

  const onAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const toggleViewMode = () => {
    if (currentViewIsMobile) setManualViewMode("desktop");
    else setManualViewMode("mobile");
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 font-sans relative transition-all ${
        currentViewIsMobile ? "pb-24" : ""
      }`}
    >
      <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
              <HardHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none uppercase tracking-tighter">
                Manutenzioni Mora
              </h1>
            </div>
          </div>

          {!currentViewIsMobile && (
            <div className="flex items-center gap-1 bg-blue-800/50 p-1.5 rounded-2xl border border-white/5">
              <NavButton
                icon={PlusCircle}
                label="Nuovo"
                active={activeTab === "new"}
                onClick={() => handleTabChange("new")}
                desktop
              />
              <NavButton
                icon={History}
                label="Storico"
                active={activeTab === "history"}
                onClick={() => handleTabChange("history")}
                desktop
              />
              <NavButton
                icon={Settings}
                label="Admin"
                active={activeTab === "admin"}
                onClick={() => handleTabChange("admin")}
                desktop
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-800 rounded-lg text-xs font-bold flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="hidden sm:inline text-green-100">
                    Online
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline text-orange-100">
                    Offline
                  </span>
                </>
              )}
            </div>
            <button
              onClick={toggleViewMode}
              title="Cambia visualizzazione"
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-blue-100 hover:text-white"
            >
              {currentViewIsMobile ? (
                <Monitor className="w-5 h-5" />
              ) : (
                <Smartphone className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Banner Sincronizzazione */}
      {pendingSyncCount > 0 && isOnline && (
        <div className="bg-emerald-500 text-white px-4 py-2 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Sincronizzazione {pendingSyncCount} rapporti...
        </div>
      )}

      {/* Banner Offline */}
      {!isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          Modalità Offline Attiva
        </div>
      )}

      {currentViewIsMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-[60] flex shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-20 px-6 pb-4 pt-2 justify-around items-center">
          <NavButton
            icon={PlusCircle}
            label="Nuovo"
            active={activeTab === "new"}
            onClick={() => handleTabChange("new")}
          />
          <NavButton
            icon={History}
            label="Storico"
            active={activeTab === "history"}
            onClick={() => handleTabChange("history")}
          />
          <NavButton
            icon={Settings}
            label="Admin"
            active={activeTab === "admin"}
            onClick={() => handleTabChange("admin")}
          />
        </nav>
      )}

      <main
        className={`max-w-6xl mx-auto ${currentViewIsMobile ? "p-4" : "p-8"} ${
          manualViewMode === "mobile" ? "max-w-[480px]" : ""
        } transition-all duration-300`}
      >
        {!user ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400 gap-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="font-black uppercase tracking-[0.3em] text-xs">
              Caricamento...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeTab === "dashboard" && (
              <DashboardView onNavigate={(tab) => handleTabChange(tab)} />
            )}
            {activeTab === "new" && (
              <NewEntryForm
                user={user}
                customers={customers}
                technicians={sortedTechnicians}
                machineTypes={machineTypes}
                machineMap={machineMap}
                machines={machines}
                onSuccess={() => setActiveTab("history")}
                isMobile={currentViewIsMobile}
                isOnline={isOnline}
              />
            )}
            {activeTab === "history" && (
              <HistoryView
                logs={logs}
                machineMap={machineMap}
                loading={loading}
                isMobile={currentViewIsMobile}
                isAdmin={isAdminAuthenticated}
                customers={customers}
                technicians={technicians}
                machineTypes={machineTypes}
                machines={machines}
                onAuthAdmin={() => {
                  setPendingTab(null);
                  setShowAdminLogin(true);
                }}
              />
            )}
            {activeTab === "admin" && isAdminAuthenticated && (
              <AdminPanel
                logs={logs}
                customers={customers}
                technicians={technicians}
                machines={machines}
                machineTypes={machineTypes}
                isMobile={currentViewIsMobile}
              />
            )}
          </div>
        )}
      </main>

      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={onAdminLoginSuccess}
          onCancel={() => {
            setShowAdminLogin(false);
            setPendingTab(null);
          }}
        />
      )}
    </div>
  );
}
