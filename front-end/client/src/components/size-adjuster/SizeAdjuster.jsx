import { useEffect, useState } from 'react';
import './SizeAdjuster.css';

function SizeAdjuster({
    garmentType = 'SHIRT',
    brandName = '',
    sizeLabel = '',
    measurements = [],
    initialAdjustments = {},
    onSave,
}) {
    // State holding numeric adjustments (+/- offset in inches) keyed by measurementTypeId or key
    const [adjustments, setAdjustments] = useState({});

    // Helper for robust key resolution per measurement item
    const getMeasurementKey = (m) => m.measurementTypeId || m.measurementType?.id || m.measurementType?.key;

    useEffect(() => {
        const initial = {};
        if (measurements && measurements.length > 0) {
            measurements.forEach((m) => {
                const key = getMeasurementKey(m);
                if (key) {
                    initial[key] = initialAdjustments[key] ?? 0;
                }
            });
        }
        setAdjustments(initial);
    }, [measurements, initialAdjustments]);

    const handleChange = (key, value) => {
        setAdjustments((prev) => ({
            ...prev,
            [key]: Number(value),
        }));
    };

    const resetAdjustments = () => {
        const resetObj = {};
        if (measurements && measurements.length > 0) {
            measurements.forEach((m) => {
                const key = getMeasurementKey(m);
                if (key) {
                    resetObj[key] = 0;
                }
            });
        }
        setAdjustments(resetObj);
    };

    const handleSave = () => {
        // Build alterations array for backend API persistence
        const alterations = (measurements || []).map((m) => {
            const key = getMeasurementKey(m);
            const adj = adjustments[key] ?? 0;
            return {
                measurementTypeId: m.measurementTypeId || m.measurementType?.id,
                measurementKey: m.measurementType?.key,
                label: m.measurementType?.label,
                adjustment: adj,
                baseValue: m.value,
                finalValue: Number((m.value + adj).toFixed(2)),
            };
        });

        if (onSave) {
            onSave(adjustments, alterations);
        }
    };

    // Calculate visual adjustment metrics for SVG preview
    const findAdjByKey = (keySearch) => {
        const match = (measurements || []).find(
            (m) => m.measurementType?.key?.toLowerCase().includes(keySearch)
        );
        if (!match) return 0;
        const key = getMeasurementKey(match);
        return adjustments[key] ?? 0;
    };

    const chestAdj = findAdjByKey('chest');
    const waistAdj = findAdjByKey('waist');
    const shoulderAdj = findAdjByKey('shoulder');
    const lengthAdj = findAdjByKey('length');
    const sleeveAdj = findAdjByKey('sleeve');

    const shirtWidth = 220 + chestAdj * 8;
    const shirtBottomWidth = 190 + waistAdj * 7;
    const shoulderWidth = 250 + shoulderAdj * 8;
    const sleeveSize = 45 + sleeveAdj * 5;

    const renderGarmentPreview = () => {
        const normGarment = String(garmentType || '').toUpperCase();
        const isJeans =
            normGarment.includes('JEANS') ||
            normGarment.includes('PANTS') ||
            normGarment.includes('TROUSER');
        const isHoodie = normGarment.includes('HOODIE');
        const isShirt = normGarment === 'SHIRT';

        if (isJeans) {
            const hipAdj = findAdjByKey('hip') || findAdjByKey('seat');
            const inseamAdj = findAdjByKey('inseam');
            const wWidth = 140 + waistAdj * 6;
            const hWidth = 170 + (hipAdj || waistAdj) * 6;
            const legLength = 260 + (inseamAdj || lengthAdj) * 7;
            const crotchY = 160 + (hipAdj || waistAdj) * 2;

            return (
                <svg viewBox="0 0 400 420" className="shirt-svg" aria-label="Adjustable Jeans preview">
                    <ellipse cx="200" cy="395" rx={hWidth / 2.2} ry="12" className="shirt-shadow" />
                    <path
                        d={`
                            M ${200 - wWidth / 2} 70
                            L ${200 + wWidth / 2} 70
                            Q ${200 + hWidth / 2} 110 ${200 + hWidth / 2 - 10} ${crotchY}
                            L ${200 + hWidth / 2 - 20} ${70 + legLength}
                            L 210 ${70 + legLength}
                            L 200 ${crotchY}
                            L 190 ${70 + legLength}
                            L ${200 - hWidth / 2 + 20} ${70 + legLength}
                            L ${200 - hWidth / 2 + 10} ${crotchY}
                            Q ${200 - hWidth / 2} 110 ${200 - wWidth / 2} 70
                            Z
                        `}
                        className="shirt-body"
                    />
                    <line x1={200 - wWidth / 2} y1="90" x2={200 + wWidth / 2} y2="90" stroke="#111" strokeWidth="2" />
                    <path d={`M 200 90 L 200 ${crotchY - 20} Q 200 ${crotchY} 210 ${crotchY}`} fill="none" stroke="#111" strokeWidth="2" />
                    <text x="200" y="210" textAnchor="middle" className="shirt-design">JEANS FIT</text>
                </svg>
            );
        }

        if (isHoodie) {
            const shirtWidth = 220 + chestAdj * 8;
            const shirtBottomWidth = 190 + waistAdj * 7;
            const shoulderWidth = 250 + shoulderAdj * 8;
            const sleeveSize = 65 + sleeveAdj * 7;

            return (
                <svg viewBox="0 0 400 420" className="shirt-svg" aria-label="Adjustable Hoodie preview">
                    <ellipse cx="200" cy="395" rx={shirtWidth / 2.4} ry="12" className="shirt-shadow" />
                    <path d="M 160 85 Q 200 15 240 85 Z" fill="#333" stroke="#111" strokeWidth="2" />
                    <path
                        d={`
                            M ${200 - shoulderWidth / 2} 85
                            L ${200 - shirtWidth / 2} 125
                            L ${200 - shirtWidth / 2 - sleeveSize} 240
                            L ${200 - shirtWidth / 2 - sleeveSize + 15} 265
                            L ${200 - shirtWidth / 2 + 5} 220
                            L ${200 - shirtWidth / 2 + 25} 175
                            L ${200 - shirtBottomWidth / 2} ${350 + lengthAdj * 4}
                            L ${200 + shirtBottomWidth / 2} ${350 + lengthAdj * 4}
                            L ${200 + shirtWidth / 2 - 25} 175
                            L ${200 + shirtWidth / 2 - 5} 220
                            L ${200 + shirtWidth / 2 + sleeveSize - 15} 265
                            L ${200 + shirtWidth / 2 + sleeveSize} 240
                            L ${200 + shirtWidth / 2} 125
                            L ${200 + shoulderWidth / 2} 85
                            L 230 75
                            Q 200 105 170 75
                            Z
                        `}
                        className="shirt-body"
                    />
                    <path d={`M 150 ${280 + lengthAdj * 2} L 250 ${280 + lengthAdj * 2} L 260 ${340 + lengthAdj * 3} L 140 ${340 + lengthAdj * 3} Z`} fill="none" stroke="#111" strokeWidth="2" />
                    <text x="200" y="215" textAnchor="middle" className="shirt-design">HOODIE FIT</text>
                </svg>
            );
        }

        if (isShirt) {
            const shirtWidth = 220 + chestAdj * 8;
            const shirtBottomWidth = 190 + waistAdj * 7;
            const shoulderWidth = 250 + shoulderAdj * 8;
            const sleeveSize = 65 + sleeveAdj * 7;

            return (
                <svg viewBox="0 0 400 420" className="shirt-svg" aria-label="Adjustable Shirt preview">
                    <ellipse cx="200" cy="395" rx={shirtWidth / 2.4} ry="12" className="shirt-shadow" />
                    <path
                        d={`
                            M ${200 - shoulderWidth / 2} 85
                            L ${200 - shirtWidth / 2} 125
                            L ${200 - shirtWidth / 2 - sleeveSize} 240
                            L ${200 - shirtWidth / 2 - sleeveSize + 15} 265
                            L ${200 - shirtWidth / 2 + 5} 220
                            L ${200 - shirtWidth / 2 + 25} 175
                            L ${200 - shirtBottomWidth / 2} ${350 + lengthAdj * 4}
                            L ${200 + shirtBottomWidth / 2} ${350 + lengthAdj * 4}
                            L ${200 + shirtWidth / 2 - 25} 175
                            L ${200 + shirtWidth / 2 - 5} 220
                            L ${200 + shirtWidth / 2 + sleeveSize - 15} 265
                            L ${200 + shirtWidth / 2 + sleeveSize} 240
                            L ${200 + shirtWidth / 2} 125
                            L ${200 + shoulderWidth / 2} 85
                            L 235 65
                            Q 200 115 165 65
                            Z
                        `}
                        className="shirt-body"
                    />
                    <line x1="200" y1="85" x2="200" y2={340 + lengthAdj * 4} stroke="#111" strokeWidth="2" strokeDasharray="6,6" />
                    <path d="M 165 65 L 185 95 L 200 85 L 215 95 L 235 65" fill="none" stroke="#111" strokeWidth="2" />
                    <text x="200" y="215" textAnchor="middle" className="shirt-design">SHIRT FIT</text>
                </svg>
            );
        }

        // Default T-shirt SVG
        const shirtWidth = 220 + chestAdj * 8;
        const shirtBottomWidth = 190 + waistAdj * 7;
        const shoulderWidth = 250 + shoulderAdj * 8;
        const sleeveSize = 45 + sleeveAdj * 5;

        return (
            <svg viewBox="0 0 400 420" className="shirt-svg" aria-label="Adjustable T-shirt preview">
                <ellipse cx="200" cy="395" rx={shirtWidth / 2.4} ry="12" className="shirt-shadow" />
                <path
                    d={`
                        M ${200 - shoulderWidth / 2} 85
                        L ${200 - shirtWidth / 2} 125
                        L ${200 - shirtWidth / 2 - sleeveSize} 180
                        L ${200 - shirtWidth / 2 - sleeveSize + 10} 215
                        L ${200 - shirtWidth / 2 + 5} 205
                        L ${200 - shirtWidth / 2 + 25} 175
                        L ${200 - shirtWidth / 2 + 30} ${105 + sleeveAdj * 3}
                        L ${200 - shirtBottomWidth / 2} ${350 + lengthAdj * 4}
                        L ${200 + shirtBottomWidth / 2} ${350 + lengthAdj * 4}
                        L ${200 + shirtWidth / 2 - 30} ${105 + sleeveAdj * 3}
                        L ${200 + shirtWidth / 2 - 25} 175
                        L ${200 + shirtWidth / 2 - 5} 205
                        L ${200 + shirtWidth / 2 + sleeveSize - 10} 215
                        L ${200 + shirtWidth / 2 + sleeveSize} 180
                        L ${200 + shirtWidth / 2} 125
                        L ${200 + shoulderWidth / 2} 85
                        L 235 65
                        Q 200 115 165 65
                        Z
                    `}
                    className="shirt-body"
                />
                <path d="M 165 65 Q 200 115 235 65" className="shirt-neck" />
                <text x="200" y="235" textAnchor="middle" className="shirt-design">T-SHIRT FIT</text>
            </svg>
        );
    };

    return (
        <div className="size-adjuster">
            {/* HEADER */}
            <div className="size-adjuster-header">
                <h2>
                    Adjust Your Fit {brandName && sizeLabel ? `(${brandName} ${sizeLabel})` : ''}
                </h2>
                <p>
                    Adjust your fit measurements visually based on standard {brandName || 'brand'} size charts.
                </p>
            </div>

            {/* MAIN CONTENT */}
            <div className="size-adjuster-content">
                {/* PREVIEW */}
                <div className="shirt-preview">
                    {renderGarmentPreview()}
                </div>

                {/* CONTROLS */}
                <div className="size-controls-container">
                    {/* CURRENT VALUES BADGES (DYNAMIC) */}
                    <div className="size-values">
                        {(measurements || []).map((m) => {
                            const key = getMeasurementKey(m);
                            const adj = adjustments[key] ?? 0;
                            const finalVal = (m.value + adj).toFixed(1);
                            const unit = m.measurementType?.unit || 'in';
                            return (
                                <span key={m.id || key}>
                                    {m.measurementType?.label}: {finalVal} {unit} ({adj > 0 ? `+${adj}` : adj})
                                </span>
                            );
                        })}
                    </div>

                    {/* DYNAMIC SLIDERS DRIVEN BY BACKEND MEASUREMENTS */}
                    <div className="size-controls">
                        {(!measurements || measurements.length === 0) && (
                            <p style={{ color: '#888', fontStyle: 'italic' }}>
                                Loading measurements from database...
                            </p>
                        )}
                        {(measurements || []).map((m) => {
                            const key = getMeasurementKey(m);
                            const adj = adjustments[key] ?? 0;
                            const baseVal = m.value;
                            const currentVal = (baseVal + adj).toFixed(1);
                            const unit = m.measurementType?.unit || 'in';

                            return (
                                <div className="slider-row" key={m.id || key}>
                                    <div className="slider-label">
                                        <span>
                                            {m.measurementType?.label} (Base: {baseVal} {unit})
                                        </span>
                                        <span>
                                            {currentVal} {unit} ({adj > 0 ? `+${adj}` : adj} {unit})
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-4"
                                        max="4"
                                        step="0.5"
                                        value={adj}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* ACTIONS */}
                    <div className="size-actions">
                        <button
                            type="button"
                            className="reset-size-btn"
                            onClick={resetAdjustments}
                        >
                            Reset
                        </button>

                        <button
                            type="button"
                            className="save-size-btn"
                            onClick={handleSave}
                        >
                            Save Fit & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SizeAdjuster;
