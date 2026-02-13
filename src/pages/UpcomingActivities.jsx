// // src/pages/Sales/UpcomingActivities.jsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from "../api/axiosInstance";
// import { getBrandTheme, getFontFamily, applyThemeToRoot } from "../utils/theme";

// const UpcomingActivities = () => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [theme, setTheme] = useState(getBrandTheme());

//   // Apply theme on mount and when theme changes
//   useEffect(() => {
//     const currentTheme = getBrandTheme();
//     setTheme(currentTheme);
//     applyThemeToRoot(currentTheme);
//   }, []);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         // Get project ID from localStorage
//         const activeProjectId = localStorage.getItem("ACTIVE_PROJECT_ID");
        
//         if (!activeProjectId) {
//           setError("No active project selected. Please select a project first.");
//           setLoading(false);
//           return;
//         }

//         // Build query parameters
//         const params = new URLSearchParams();
//         params.append("project_id", activeProjectId);
        
//         if (dateFrom) {
//           params.append("date_from", dateFrom);
//         }
//         if (dateTo) {
//           params.append("date_to", dateTo);
//         }

//         const url = `/sales/upcoming-activity/?${params.toString()}`;
//         const res = await axiosInstance.get(url);
//         setActivities(res.data || []);
//       } catch (err) {
//         console.error("Error loading activities:", err);
//         setError("Failed to load upcoming activities.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [dateFrom, dateTo]);

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   // Helper function to format time
//   const formatTime = (timeString) => {
//     if (!timeString) return "N/A";
//     try {
//       const [hours, minutes] = timeString.split(":");
//       const hour12 = parseInt(hours) % 12 || 12;
//       const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
//       return `${hour12}:${minutes} ${ampm}`;
//     } catch {
//       return timeString;
//     }
//   };

//   // Get status badge color
//   const getStatusColor = (status) => {
//     const statusLower = (status || "").toLowerCase();
//     if (statusLower === "scheduled") return { bg: "#dbeafe", color: "#1e40af", border: "#3b82f6" };
//     if (statusLower === "completed") return { bg: "#d1fae5", color: "#065f46", border: "#10b981" };
//     if (statusLower === "cancelled") return { bg: "#fee2e2", color: "#991b1b", border: "#ef4444" };
//     return { bg: "#f3f4f6", color: "#374151", border: "#9ca3af" };
//   };

//   // Get activity type badge
//   const getActivityTypeLabel = (kind) => {
//     if (!kind) return "Activity";
//     return kind.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   // Filter leads with activities
//   const leadsWithActivities = activities.filter((lead) => lead.items && lead.items.length > 0);
//   const leadsWithoutActivities = activities.filter((lead) => !lead.items || lead.items.length === 0);

//   // ---------- LOADING ----------
//   if (loading) {
//     return (
//       <div
//         style={{
//           padding: "40px",
//           textAlign: "center",
//           fontSize: `${theme.base_font_size}px`,
//           color: "#666",
//           fontFamily: getFontFamily(theme.font_family),
//           background: theme.background_color,
//           minHeight: "100vh",
//         }}
//       >
//         <div style={{ marginBottom: "12px" }}>⏳</div>
//         Loading upcoming activities...
//       </div>
//     );
//   }

//   // ---------- ERROR ----------
//   if (error) {
//     return (
//       <div
//         style={{
//           padding: "20px",
//           fontFamily: getFontFamily(theme.font_family),
//           background: theme.background_color,
//           minHeight: "100vh",
//         }}
//       >
//         <div
//           style={{
//             color: "#dc2626",
//             fontSize: `${theme.base_font_size}px`,
//             padding: "12px 16px",
//             background: "#fef2f2",
//             borderRadius: "8px",
//             border: "1px solid #fecaca",
//           }}
//         >
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         padding: "24px",
//         fontFamily: getFontFamily(theme.font_family),
//         background: theme.background_color,
//         minHeight: "100vh",
//         fontSize: `${theme.base_font_size}px`,
//       }}
//     >
//       {/* Header */}
//       <div style={{ marginBottom: "24px" }}>
//         <h1
//           style={{
//             fontSize: "28px",
//             fontWeight: "700",
//             marginBottom: "8px",
//             color: theme.heading_color,
//           }}
//         >
//           Upcoming Activities
//         </h1>
//         <p style={{ fontSize: `${theme.base_font_size}px`, color: "#6b7280" }}>
//           {leadsWithActivities.length > 0
//             ? `${leadsWithActivities.reduce((sum, lead) => sum + (lead.items?.length || 0), 0)} activity(s) across ${leadsWithActivities.length} lead(s)`
//             : "No activities scheduled"}
//         </p>
//       </div>

//       {/* Date Filters */}
//       <div
//         style={{
//           marginBottom: "24px",
//           padding: "16px",
//           background: "white",
//           borderRadius: "12px",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//           display: "flex",
//           gap: "16px",
//           alignItems: "flex-end",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={{ flex: "1", minWidth: "180px" }}>
//           <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#374151" }}>
//             Date From
//           </label>
//           <input
//             type="date"
//             value={dateFrom}
//             onChange={(e) => setDateFrom(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "10px 12px",
//               border: "1px solid #d1d5db",
//               borderRadius: "8px",
//               fontSize: `${theme.base_font_size}px`,
//               outline: "none",
//               transition: "border-color 0.2s",
//             }}
//             onFocus={(e) => (e.target.style.borderColor = theme.accent_color)}
//             onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//           />
//         </div>
//         <div style={{ flex: "1", minWidth: "180px" }}>
//           <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#374151" }}>
//             Date To
//           </label>
//           <input
//             type="date"
//             value={dateTo}
//             onChange={(e) => setDateTo(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "10px 12px",
//               border: "1px solid #d1d5db",
//               borderRadius: "8px",
//               fontSize: `${theme.base_font_size}px`,
//               outline: "none",
//               transition: "border-color 0.2s",
//             }}
//             onFocus={(e) => (e.target.style.borderColor = theme.accent_color)}
//             onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
//           />
//         </div>
//         {(dateFrom || dateTo) && (
//           <button
//             onClick={() => {
//               setDateFrom("");
//               setDateTo("");
//             }}
//             style={{
//               padding: "10px 20px",
//               background: theme.button_primary_bg,
//               color: theme.button_primary_text,
//               border: "none",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: `${theme.base_font_size}px`,
//               fontWeight: "500",
//               transition: "background 0.2s",
//               fontFamily: getFontFamily(theme.font_family),
//             }}
//             onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
//             onMouseLeave={(e) => (e.target.style.opacity = "1")}
//           >
//             Clear Filters
//           </button>
//         )}
//       </div>

//       {/* Leads with Activities */}
//       {leadsWithActivities.length > 0 && (
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//           {leadsWithActivities.map((lead, leadIndex) => (
//             <div
//               key={lead.lead_id || leadIndex}
//               style={{
//                 background: "white",
//                 borderRadius: "12px",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                 overflow: "hidden",
//               }}
//             >
//               {/* Lead Header */}
//               <div
//                 style={{
//                   padding: "20px",
//                   background: `linear-gradient(135deg, ${theme.primary_color} 0%, ${theme.accent_color} 100%)`,
//                   color: theme.secondary_color,
//                 }}
//               >
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
//                   <div>
//                     <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "4px", margin: "0 0 4px 0" }}>
//                       {lead.lead_name || "Unknown Lead"}
//                     </h2>
//                     <p style={{ fontSize: "13px", opacity: 0.9, margin: 0 }}>
//                       {lead.project_name || "N/A"} • Lead ID: {lead.lead_id}
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       padding: "6px 12px",
//                       background: "rgba(255,255,255,0.2)",
//                       borderRadius: "20px",
//                       fontSize: "13px",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {lead.items?.length || 0} {lead.items?.length === 1 ? "Activity" : "Activities"}
//                   </div>
//                 </div>
//               </div>

//               {/* Activities List */}
//               <div style={{ padding: "20px" }}>
//                 <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//                   {lead.items?.map((item, itemIndex) => {
//                     const statusColors = getStatusColor(item.status);
//                     return (
//                       <div
//                         key={item.id || itemIndex}
//                         style={{
//                           padding: "16px",
//                           border: "1px solid #e5e7eb",
//                           borderRadius: "10px",
//                           background: "#fafafa",
//                           transition: "all 0.2s",
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.borderColor = theme.accent_color;
//                           e.currentTarget.style.background = `${theme.accent_color}10`;
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.borderColor = "#e5e7eb";
//                           e.currentTarget.style.background = "#fafafa";
//                         }}
//                       >
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
//                           <div style={{ flex: "1", minWidth: "200px" }}>
//                             <h3
//                               style={{
//                                 fontSize: "16px",
//                                 fontWeight: "600",
//                                 margin: "0 0 8px 0",
//                                 color: theme.heading_color,
//                               }}
//                             >
//                               {item.title || "Untitled Activity"}
//                             </h3>
//                             <div
//                               style={{
//                                 display: "inline-block",
//                                 padding: "4px 10px",
//                                 borderRadius: "6px",
//                                 fontSize: "11px",
//                                 fontWeight: "600",
//                                 textTransform: "uppercase",
//                                 letterSpacing: "0.5px",
//                                 background: statusColors.bg,
//                                 color: statusColors.color,
//                                 border: `1px solid ${statusColors.border}`,
//                               }}
//                             >
//                               {item.status || "Unknown"}
//                             </div>
//                           </div>
//                           <div style={{ textAlign: "right" }}>
//                             <div
//                               style={{
//                                 fontSize: "14px",
//                                 fontWeight: "600",
//                                 color: theme.heading_color,
//                                 marginBottom: "4px",
//                               }}
//                             >
//                               {formatDate(item.event_date)}
//                             </div>
//                             <div style={{ fontSize: "13px", color: "#6b7280" }}>{formatTime(item.event_time)}</div>
//                           </div>
//                         </div>

//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: "#6b7280" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                             <span style={{ fontWeight: "500", color: "#374151" }}>Type:</span>
//                             <span>{getActivityTypeLabel(item.kind)}</span>
//                           </div>
//                           {item.raw_type && (
//                             <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                               <span style={{ fontWeight: "500", color: "#374151" }}>Category:</span>
//                               <span>{item.raw_type}</span>
//                             </div>
//                           )}
//                           {item.location_name && (
//                             <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                               <span style={{ fontWeight: "500", color: "#374151" }}>Location:</span>
//                               <span>{item.location_name}</span>
//                             </div>
//                           )}
//                         </div>

//                         {item.description && (
//                           <div
//                             style={{
//                               marginTop: "12px",
//                               padding: "12px",
//                               background: "#f3f4f6",
//                               borderRadius: "8px",
//                               fontSize: "13px",
//                               color: "#374151",
//                               lineHeight: "1.5",
//                             }}
//                           >
//                             <span style={{ fontWeight: "500", color: theme.heading_color }}>Description: </span>
//                             {item.description}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Leads without Activities */}
//       {leadsWithoutActivities.length > 0 && (
//         <div style={{ marginTop: "24px" }}>
//           <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#6b7280" }}>
//             Leads with No Scheduled Activities ({leadsWithoutActivities.length})
//           </h3>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
//             {leadsWithoutActivities.map((lead, index) => (
//               <div
//                 key={lead.lead_id || index}
//                 style={{
//                   padding: "12px 16px",
//                   background: "white",
//                   borderRadius: "8px",
//                   border: "1px solid #e5e7eb",
//                   fontSize: "14px",
//                   color: "#6b7280",
//                 }}
//               >
//                 {lead.lead_name || "Unknown Lead"} ({lead.project_name || "N/A"})
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Empty State */}
//       {activities.length === 0 && (
//         <div
//           style={{
//             padding: "60px 20px",
//             textAlign: "center",
//             background: "white",
//             borderRadius: "12px",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
//           <h3
//             style={{
//               fontSize: "18px",
//               fontWeight: "600",
//               marginBottom: "8px",
//               color: theme.heading_color,
//             }}
//           >
//             No Upcoming Activities
//           </h3>
//           <p style={{ fontSize: "14px", color: "#6b7280" }}>
//             {dateFrom || dateTo
//               ? "No activities found for the selected date range."
//               : "There are no scheduled activities at the moment."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingActivities;

// src/pages/Sales/UpcomingActivities.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { getBrandTheme, getFontFamily, applyThemeToRoot } from "../utils/theme";

const UpcomingActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [theme, setTheme] = useState(getBrandTheme());

  // Apply theme on mount
  useEffect(() => {
    const currentTheme = getBrandTheme();
    setTheme(currentTheme);
    applyThemeToRoot(currentTheme);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activeProjectId = localStorage.getItem("ACTIVE_PROJECT_ID");
        if (!activeProjectId) {
          setError("No active project selected. Please select a project first.");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams();
        params.append("project_id", activeProjectId);
        if (dateFrom) params.append("date_from", dateFrom);
        if (dateTo) params.append("date_to", dateTo);

        const url = `/sales/upcoming-activity/?${params.toString()}`;
        const res = await axiosInstance.get(url);
        setActivities(res.data || []);
      } catch (err) {
        console.error("Error loading activities:", err);
        setError("Failed to load upcoming activities.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [dateFrom, dateTo]);

  // Original Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Original Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Original Activity type badge logic
  const getActivityTypeLabel = (kind) => {
    if (!kind) return "Activity";
    return kind.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // UI Specific Branding Logic
  const getTypeBranding = (kind) => {
    const type = (kind || "").toLowerCase();
    if (type.includes("call")) return { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE", icon: "⚡" };
    if (type.includes("visit")) return { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA", icon: "📍" };
    if (type.includes("meeting")) return { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", icon: "🤝" };
    return { bg: "#FAF5FF", text: "#9333EA", border: "#E9D5FF", icon: "✨" };
  };

  const leadsWithActivities = activities.filter((lead) => lead.items && lead.items.length > 0);
  const leadsWithoutActivities = activities.filter((lead) => !lead.items || lead.items.length === 0);

  // ---------- LOADING ----------
  if (loading) {
    return (
      <div style={{ height: "100vh", background: "#F5F7FF", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: getFontFamily(theme.font_family) }}>
        <div className="loader-orbit" />
        <style>{`
          .loader-orbit { width: 50px; height: 50px; border: 3px solid #E0E7FF; border-top: 3px solid #6366F1; border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error) {
    return (
      <div style={{ padding: "40px", background: "#F5F7FF", minHeight: "100vh", textAlign: "center", fontFamily: getFontFamily(theme.font_family) }}>
        <div style={{ color: "#dc2626", padding: "20px", background: "#fef2f2", borderRadius: "16px", border: "1px solid #fecaca", display: "inline-block" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #F5F7FF 0%, #E0E7FF 100%)", 
      minHeight: "100vh", padding: "50px 20px", 
      fontFamily: getFontFamily(theme.font_family), color: "#1E1B4B" 
    }}>
      
      <style>{`
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-card { animation: slideInUp 0.5s ease forwards; opacity: 0; }
        .card-inner:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(79, 70, 229, 0.15); border-color: #6366F1; }
        .glass-header { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid #FFFFFF; }
      `}</style>

      {/* --- HEADER SECTION --- */}
      <div className="glass-header" style={{ maxWidth: "1200px", margin: "0 auto 40px", padding: "30px", borderRadius: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", margin: 0, color: theme.heading_color || "#1E1B4B" }}>Upcoming Activities</h1>
          <p style={{ margin: "5px 0 0 0", color: "#64748B", fontWeight: "500" }}>
             {leadsWithActivities.length > 0
              ? `${leadsWithActivities.reduce((sum, lead) => sum + (lead.items?.length || 0), 0)} activity(s) across ${leadsWithActivities.length} lead(s)`
              : "No activities scheduled"}
          </p>
        </div>

        {/* --- DATE FILTERS (Original Logic) --- */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ display: "flex", background: "#fff", padding: "5px 15px", borderRadius: "15px", border: "1px solid #E0E7FF" }}>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ background: "transparent", border: "none", color: "#4F46E5", outline: "none", padding: "8px", fontWeight: "600" }} />
            <span style={{ alignSelf: "center", opacity: 0.2 }}>|</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ background: "transparent", border: "none", color: "#4F46E5", outline: "none", padding: "8px", fontWeight: "600" }} />
          </div>
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(""); setDateTo(""); }} style={{ background: "#FF4D4D", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>Clear</button>
          )}
        </div>
      </div>

      {/* --- LEADS WITH ACTIVITIES (BENTO GRID) --- */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "25px" }}>
        {leadsWithActivities.map((lead, leadIdx) => 
          lead.items.map((item, itemIdx) => {
            const ui = getTypeBranding(item.kind);
            return (
              <div key={`${lead.lead_id}-${itemIdx}`} className="animate-card" style={{ animationDelay: `${(leadIdx + itemIdx) * 0.05}s` }}>
                <div className="card-inner" style={{ background: "#fff", borderRadius: "32px", padding: "30px", transition: "0.4s", border: "1px solid #fff", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
                  
                  {/* Type Badge */}
                  <div style={{ position: "absolute", top: "25px", right: "25px", background: ui.bg, color: ui.text, padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "900", border: `1px solid ${ui.border}` }}>
                    {ui.icon} {getActivityTypeLabel(item.kind)}
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>{item.status || "Scheduled"}</div>
                    <h3 style={{ margin: "5px 0", fontSize: "20px", fontWeight: "800", color: theme.heading_color, lineHeight: "1.3", maxWidth: "80%" }}>{item.title || "Untitled Activity"}</h3>
                  </div>

                  {item.description && (
                    <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.6", background: "#F8FAFC", padding: "15px", borderRadius: "16px", marginBottom: "20px" }}>
                      {item.description}
                    </p>
                  )}

                  <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F1F5F9", padding: "12px 16px", borderRadius: "16px" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "800" }}>{lead.lead_name}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>ID: {lead.lead_id}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: "800", color: "#4F46E5" }}>{formatTime(item.event_time)}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{formatDate(item.event_date)}</div>
                      </div>
                    </div>
                    
                    {item.location_name && (
                      <div style={{ fontSize: "12px", color: "#64748B", display: "flex", alignItems: "center", gap: "5px" }}>
                        📍 <span>{item.location_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- LEADS WITHOUT ACTIVITIES (Original Section Kept) --- */}
      {leadsWithoutActivities.length > 0 && (
        <div style={{ maxWidth: "1200px", margin: "50px auto 0" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px", color: "#64748B", textAlign: "center" }}>
            Leads with No Scheduled Activities ({leadsWithoutActivities.length})
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {leadsWithoutActivities.map((lead, index) => (
              <div key={lead.lead_id || index} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.5)", borderRadius: "15px", border: "1px solid #E0E7FF", fontSize: "14px", fontWeight: "600", color: "#4F46E5" }}>
                {lead.lead_name || "Unknown Lead"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- EMPTY STATE (Original Logic) --- */}
      {activities.length === 0 && (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>📅</div>
          <h3 style={{ fontSize: "24px", fontWeight: "900", color: theme.heading_color }}>No Upcoming Activities</h3>
          <p style={{ color: "#64748B" }}>
            {dateFrom || dateTo ? "No activities found for the selected date range." : "There are no scheduled activities at the moment."}
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingActivities;
