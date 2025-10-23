// src/MasterDataModal.jsx
import React, { useState } from "react";

/**
 * MasterDataModal
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - initial: optional initial values object
 * - onSave: (values) => void
 */
export default function MasterDataModal({ open, onClose, initial = {}, onSave }) {
  const initialValues = {
    reportingPeriod: initial.reportingPeriod || "002.2025",
    // Inflation group (header)
    inflation: initial.inflation || "", // kept as header label (not editable)
    labor: initial.labor || "6%",
    fohFix: initial.fohFix || "3.50%",
    fohVar: initial.fohVar || "3.50%",
    incrementalDepreciation: initial.incrementalDepreciation || "Keep",

    // CR group (header)
    cr: initial.cr || "", // header label placeholder (not editable)
    crLabor: initial.crLabor || "-3.40%",
    crFohFix: initial.crFohFix || "-2.60%",
    crFohVar: initial.crFohVar || "-2.60%",
    crIncrementalDepreciation: initial.crIncrementalDepreciation || "Keep",

    // standalone fields
    pressWelding: initial.pressWelding || "3.70%",
    trComp: initial.trComp || "0.00%",
    nrComp: initial.nrComp || "0.00%",
  };

  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);

  // Helpers for percent formatting
  const formatPercent = (v) => {
    if (v == null) return "";
    const s = String(v).trim();
    if (s === "" || s.toLowerCase() === "keep") return s;
    if (s.endsWith("%")) {
      // normalize comma to dot inside
      return s.replace(",", ".").replace(/\s+/g, "");
    }
    const replaced = s.replace(",", ".");
    const num = Number(replaced);
    if (Number.isFinite(num)) {
      return `${num.toFixed(2)}%`;
    }
    return s;
  };

  const onChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onBlurPercent = (field) => (e) => {
    const raw = e.target.value;
    setValues((prev) => ({ ...prev, [field]: formatPercent(raw) }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (!values.reportingPeriod) {
      alert("Reporting Period is required.");
      setSaving(false);
      return;
    }

    const payload = { ...values };

    const parsePercentToNumber = (s) => {
      if (s == null) return null;
      const str = String(s).trim();
      if (str === "" || str.toLowerCase() === "keep") return str === "" ? null : "Keep";
      const cleaned = str.replace("%", "").replace(",", ".").trim();
      const n = Number(cleaned);
      return Number.isFinite(n) ? n / 100 : null;
    };

    payload._parsed = {
      labor: parsePercentToNumber(values.labor),
      fohFix: parsePercentToNumber(values.fohFix),
      fohVar: parsePercentToNumber(values.fohVar),
      incrementalDepreciation: values.incrementalDepreciation,
      crLabor: parsePercentToNumber(values.crLabor),
      crFohFix: parsePercentToNumber(values.crFohFix),
      crFohVar: parsePercentToNumber(values.crFohVar),
      crIncrementalDepreciation: values.crIncrementalDepreciation,
      pressWelding: parsePercentToNumber(values.pressWelding),
      trComp: parsePercentToNumber(values.trComp),
      nrComp: parsePercentToNumber(values.nrComp),
    };

    // Simulate async save (replace with real API call)
    await new Promise((res) => setTimeout(res, 600));

    setSaving(false);
    if (onSave) onSave(payload);
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

      <div style={{
        width: 800,
        maxWidth: "calc(100% - 32px)",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(2,6,23,0.2)",
        padding: 22,
        zIndex: 1010
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Maintain Master Data</h3>
          <div>
            <button onClick={onClose} style={{ marginLeft: 8 }} className="btn btn-ghost">✕</button>
          </div>
        </div>

        <div style={{ marginTop: 10, color: "#374151", fontSize: 13 }}>
          Edit master data values. Percent fields accept `6`, `6%`, `3.50`, or `3,50` and format on blur.
        </div>

        <form style={{ marginTop: 14 }} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Reporting Period */}
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0b1220", marginBottom: 6 }}>Reporting Period</span>
              <select
                value={values.reportingPeriod}
                onChange={(e) => setValues((p) => ({ ...p, reportingPeriod: e.target.value }))}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              >
                <option>002.2025</option>
                <option>001.2025</option>
                <option>003.2025</option>
                <option>004.2025</option>
              </select>
            </label>

            {/* Placeholder column to keep grid balanced */}
            <div />

            {/* --- Inflation section header --- */}
            <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0b1220", marginBottom: 8 }}>Inflation</div>
            </div>

            {/* Inflation group fields (two columns) */}
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Labor</span>
              <input
                value={values.labor}
                onChange={onChange("labor")}
                onBlur={onBlurPercent("labor")}
                placeholder="6%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>FOH Fix</span>
              <input
                value={values.fohFix}
                onChange={onChange("fohFix")}
                onBlur={onBlurPercent("fohFix")}
                placeholder="3.50%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>FOH Var</span>
              <input
                value={values.fohVar}
                onChange={onChange("fohVar")}
                onBlur={onBlurPercent("fohVar")}
                placeholder="3.50%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Incremental Depreciation</span>
              <input
                value={values.incrementalDepreciation}
                onChange={(e) => setValues((p) => ({ ...p, incrementalDepreciation: e.target.value }))}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            {/* spacer row / divider */}
            <div style={{ gridColumn: "1 / -1", height: 1, marginTop: 6, borderTop: "1px solid rgba(0,0,0,0.06)" }} />

            {/* --- CR section header --- */}
            <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0b1220", marginBottom: 8 }}>CR</div>
            </div>

            {/* CR group fields */}
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Labor</span>
              <input
                value={values.crLabor}
                onChange={onChange("crLabor")}
                onBlur={onBlurPercent("crLabor")}
                placeholder="-3.40%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>FOH Fix</span>
              <input
                value={values.crFohFix}
                onChange={onChange("crFohFix")}
                onBlur={onBlurPercent("crFohFix")}
                placeholder="-2.60%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>FOH Var</span>
              <input
                value={values.crFohVar}
                onChange={onChange("crFohVar")}
                onBlur={onBlurPercent("crFohVar")}
                placeholder="-2.60%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Incremental Depreciation</span>
              <input
                value={values.crIncrementalDepreciation}
                onChange={(e) => setValues((p) => ({ ...p, crIncrementalDepreciation: e.target.value }))}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            {/* spacer row / divider */}
            <div style={{ gridColumn: "1 / -1", height: 1, marginTop: 6, borderTop: "1px solid rgba(0,0,0,0.06)" }} />            

            {/* Standalone fields (no header) */}
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>Press & Welding</span>
              <input
                value={values.pressWelding}
                onChange={onChange("pressWelding")}
                onBlur={onBlurPercent("pressWelding")}
                placeholder="3.70%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>TR Comp</span>
              <input
                value={values.trComp}
                onChange={onChange("trComp")}
                onBlur={onBlurPercent("trComp")}
                placeholder="0.00%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>NR Comp</span>
              <input
                value={values.nrComp}
                onChange={onChange("nrComp")}
                onBlur={onBlurPercent("nrComp")}
                placeholder="0.00%"
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
              />
            </label>

          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
