import { Outlet, useLocation, useNavigate } from "react-router";
import { BookOpen, FileText, User, Check } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName] = useState("Estudiante");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "local">("local");

  useEffect(() => {
    // Simular guardado automático
    setSaveStatus("saving");
    const timer = setTimeout(() => setSaveStatus("local"), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const menuItems = [
    { path: "/", icon: BookOpen, label: "Ramos" },
    { path: "/resumen", icon: FileText, label: "Resumen" },
    { path: "/perfil", icon: User, label: "Perfil" },
  ];

  const currentIndex = menuItems.findIndex((item) => 
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col max-w-md mx-auto overflow-hidden">
      {/* Header estilo iOS */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 pt-12 pb-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">N</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">NotasApp</h1>
            </div>
          </div>

          {/* Estado de guardado */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <motion.div
              animate={{
                scale: saveStatus === "saving" ? [1, 1.2, 1] : 1,
                rotate: saveStatus === "saving" ? [0, 360] : 0,
              }}
              transition={{ duration: 0.6, repeat: saveStatus === "saving" ? Infinity : 0 }}
            >
              <Check className={`w-3.5 h-3.5 ${saveStatus === "local" ? "text-green-600" : "text-slate-400"}`} />
            </motion.div>
            <span className="text-xs font-medium text-slate-600">
              {saveStatus === "local" ? "Local" : "Guardando..."}
            </span>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <p className="text-slate-600 text-sm">
          Hola, <span className="font-medium text-slate-900">{userName}</span> 👋
        </p>
      </div>

      {/* Contenido de la página */}
      <div className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </div>

      {/* Menú inferior circular estilo liquid glass */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto pb-6 px-6">
        <div className="relative bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 p-2">
          {/* Indicador de página activa con efecto liquid */}
          <motion.div
            className="absolute top-2 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[24px] shadow-lg"
            initial={false}
            animate={{
              left: `${(currentIndex * 33.333) + 2}%`,
              width: "30%",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />

          {/* Botones del menú */}
          <div className="relative grid grid-cols-3 gap-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === currentIndex;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="relative h-14 flex flex-col items-center justify-center gap-0.5 rounded-[24px] transition-all"
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-white" : "text-slate-600"
                      }`}
                    />
                  </motion.div>
                  <motion.span
                    className={`text-[10px] font-medium transition-colors ${
                      isActive ? "text-white" : "text-slate-600"
                    }`}
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {item.label}
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
