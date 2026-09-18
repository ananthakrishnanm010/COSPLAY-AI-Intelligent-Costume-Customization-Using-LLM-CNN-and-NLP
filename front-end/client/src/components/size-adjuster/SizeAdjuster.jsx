import { useEffect, useState } from 'react';
import './SizeAdjuster.css';

function SizeAdjuster({
    onSave,
    initialAdjustments = {},
}) {
    const [adjustments, setAdjustments] = useState({
        chest: initialAdjustments.chest ?? 0,
        waist: initialAdjustments.waist ?? 0,
        shoulder: initialAdjustments.shoulder ?? 0,
        length: initialAdjustments.length ?? 0,
        sleeve: initialAdjustments.sleeve ?? 0,
    });

    // Load the previously saved slider values whenever
    // the adjuster is opened or the initial values change.
    useEffect(() => {
        setAdjustments({
            chest: initialAdjustments.chest ?? 0,
            waist: initialAdjustments.waist ?? 0,
            shoulder: initialAdjustments.shoulder ?? 0,
            length: initialAdjustments.length ?? 0,
            sleeve: initialAdjustments.sleeve ?? 0,
        });
    }, [initialAdjustments]);

    const handleChange = (measurement, value) => {
        setAdjustments((previous) => ({
            ...previous,
            [measurement]: Number(value),
        }));
    };

    const resetAdjustments = () => {
        setAdjustments({
            chest: 0,
            waist: 0,
            shoulder: 0,
            length: 0,
            sleeve: 0,
        });
    };

    const handleSave = () => {
        console.log('Saved size adjustments:', adjustments);

        if (onSave) {
            onSave(adjustments);
        }
    };


    // ==========================================
    // SHIRT VISUAL VALUES
    // ==========================================

    const shirtWidth = 220 + adjustments.chest * 8;

    const shirtBottomWidth =
        190 + adjustments.waist * 7;

    const shirtHeight =
        260 + adjustments.length * 8;

    const shoulderWidth =
        250 + adjustments.shoulder * 8;

    const sleeveSize =
        45 + adjustments.sleeve * 5;


    return (
        <div className="size-adjuster">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="size-adjuster-header">

                <h2>
                    Adjust Your Size
                </h2>

                <p>
                    Adjust the fit visually. You don't need to
                    know your exact body measurements.
                </p>

            </div>


            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <div className="size-adjuster-content">


                {/* =================================
                    SHIRT PREVIEW
                ================================== */}

                <div className="shirt-preview">

                    <svg
                        viewBox="0 0 400 420"
                        className="shirt-svg"
                        aria-label="Adjustable T-shirt preview"
                    >

                        {/* Shadow */}

                        <ellipse
                            cx="200"
                            cy="395"
                            rx={shirtWidth / 2.4}
                            ry="12"
                            className="shirt-shadow"
                        />


                        {/* T-Shirt */}

                        <path
                            d={`
                                M ${200 - shoulderWidth / 2} 85

                                L ${200 - shirtWidth / 2} 125

                                L ${200 - shirtWidth / 2 - sleeveSize} 180

                                L ${200 - shirtWidth / 2 - sleeveSize + 10} 215

                                L ${200 - shirtWidth / 2 + 5} 205

                                L ${200 - shirtWidth / 2 + 25} 175

                                L ${200 - shirtWidth / 2 + 30}
                                ${105 + adjustments.sleeve * 3}

                                L ${200 - shirtBottomWidth / 2}
                                ${350 + adjustments.length * 4}

                                L ${200 + shirtBottomWidth / 2}
                                ${350 + adjustments.length * 4}

                                L ${200 + shirtWidth / 2 - 30}
                                ${105 + adjustments.sleeve * 3}

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


                        {/* Neckline */}

                        <path
                            d="M 165 65 Q 200 115 235 65"
                            className="shirt-neck"
                        />


                        {/* Design placeholder */}

                        <text
                            x="200"
                            y="235"
                            textAnchor="middle"
                            className="shirt-design"
                        >
                            DESIGN
                        </text>

                    </svg>

                </div>


                {/* =================================
                    CONTROLS
                ================================== */}

                <div className="size-controls-container">


                    {/* =================================
                        CURRENT VALUES
                    ================================== */}

                    <div className="size-values">

                        <span>
                            Chest:
                            {' '}
                            {adjustments.chest > 0 ? '+' : ''}
                            {adjustments.chest}
                        </span>

                        <span>
                            Waist:
                            {' '}
                            {adjustments.waist > 0 ? '+' : ''}
                            {adjustments.waist}
                        </span>

                        <span>
                            Shoulder:
                            {' '}
                            {adjustments.shoulder > 0 ? '+' : ''}
                            {adjustments.shoulder}
                        </span>

                        <span>
                            Length:
                            {' '}
                            {adjustments.length > 0 ? '+' : ''}
                            {adjustments.length}
                        </span>

                        <span>
                            Sleeve:
                            {' '}
                            {adjustments.sleeve > 0 ? '+' : ''}
                            {adjustments.sleeve}
                        </span>

                    </div>


                    {/* =================================
                        SLIDERS
                    ================================== */}

                    <div className="size-controls">


                        {/* CHEST */}

                        <div className="slider-row">

                            <div className="slider-label">

                                <span>
                                    Chest
                                </span>

                                <span>
                                    {adjustments.chest > 0 ? '+' : ''}
                                    {adjustments.chest}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="-3"
                                max="3"
                                step="1"
                                value={adjustments.chest}
                                onChange={(event) =>
                                    handleChange(
                                        'chest',
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* WAIST */}

                        <div className="slider-row">

                            <div className="slider-label">

                                <span>
                                    Waist
                                </span>

                                <span>
                                    {adjustments.waist > 0 ? '+' : ''}
                                    {adjustments.waist}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="-3"
                                max="3"
                                step="1"
                                value={adjustments.waist}
                                onChange={(event) =>
                                    handleChange(
                                        'waist',
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* SHOULDER */}

                        <div className="slider-row">

                            <div className="slider-label">

                                <span>
                                    Shoulder
                                </span>

                                <span>
                                    {adjustments.shoulder > 0
                                        ? '+'
                                        : ''}
                                    {adjustments.shoulder}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="-3"
                                max="3"
                                step="1"
                                value={adjustments.shoulder}
                                onChange={(event) =>
                                    handleChange(
                                        'shoulder',
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* LENGTH */}

                        <div className="slider-row">

                            <div className="slider-label">

                                <span>
                                    Length
                                </span>

                                <span>
                                    {adjustments.length > 0
                                        ? '+'
                                        : ''}
                                    {adjustments.length}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="-3"
                                max="3"
                                step="1"
                                value={adjustments.length}
                                onChange={(event) =>
                                    handleChange(
                                        'length',
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* SLEEVE */}

                        <div className="slider-row">

                            <div className="slider-label">

                                <span>
                                    Sleeve
                                </span>

                                <span>
                                    {adjustments.sleeve > 0
                                        ? '+'
                                        : ''}
                                    {adjustments.sleeve}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="-3"
                                max="3"
                                step="1"
                                value={adjustments.sleeve}
                                onChange={(event) =>
                                    handleChange(
                                        'sleeve',
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================
                        BUTTONS
                    ================================== */}

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
                            Save Size
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SizeAdjuster;