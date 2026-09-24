import { useEffect, useMemo, useState } from 'react';
import './SizeAdjuster.css';

function SizeAdjuster({
    garmentType = 'TSHIRT',
    brandName = '',
    sizeLabel = '',
    measurements = [],
    initialAdjustments = {},
    onSave,
}) {
    const [adjustments, setAdjustments] = useState({});

    /* =========================================
       MEASUREMENT HELPERS
    ========================================= */

    const getMeasurementKey = (m) => {
        return (
            m?.measurementType?.key ||
            m?.measurementType?.id ||
            m?.measurementTypeId
        );
    };

    const getMeasurement = (key) => {
        return (measurements || []).find(
            (m) =>
                String(
                    m?.measurementType?.key || ''
                ).toLowerCase() === key.toLowerCase()
        );
    };

    const getValue = (key, fallback = 0) => {
        const measurement = getMeasurement(key);

        if (!measurement) {
            return fallback;
        }

        const measurementKey =
            getMeasurementKey(measurement);

        return (
            Number(measurement.value || 0) +
            Number(adjustments[measurementKey] || 0)
        );
    };

    /* =========================================
       INITIALIZE ADJUSTMENTS
    ========================================= */

    useEffect(() => {
        const initial = {};

        (measurements || []).forEach((m) => {
            const key = getMeasurementKey(m);

            if (key) {
                initial[key] = Number(
                    initialAdjustments?.[key] ?? 0
                );
            }
        });

        setAdjustments(initial);
    }, [measurements, initialAdjustments]);

    /* =========================================
       HANDLE SLIDER CHANGE
    ========================================= */

    const handleChange = (key, value) => {
        setAdjustments((prev) => ({
            ...prev,
            [key]: Number(value),
        }));
    };

    /* =========================================
       RESET
    ========================================= */

    const resetAdjustments = () => {
        const reset = {};

        (measurements || []).forEach((m) => {
            const key = getMeasurementKey(m);

            if (key) {
                reset[key] = 0;
            }
        });

        setAdjustments(reset);
    };

    /* =========================================
       SAVE
    ========================================= */

    const handleSave = () => {
        const alterations = (measurements || []).map(
            (m) => {
                const key = getMeasurementKey(m);

                const adjustment = Number(
                    adjustments[key] || 0
                );

                return {
                    measurementTypeId:
                        m.measurementTypeId ||
                        m.measurementType?.id,

                    measurementKey:
                        m.measurementType?.key,

                    label:
                        m.measurementType?.label,

                    unit:
                        m.measurementType?.unit ||
                        'inch',

                    adjustment,

                    baseValue:
                        Number(m.value),

                    finalValue:
                        Number(
                            (
                                Number(m.value) +
                                adjustment
                            ).toFixed(2)
                        ),
                };
            }
        );

        if (onSave) {
            onSave(
                adjustments,
                alterations
            );
        }
    };

    /* =========================================
       CURRENT MEASUREMENTS
    ========================================= */

    const chest = getValue(
        'chest',
        38
    );

    const shoulder = getValue(
        'shoulder',
        16.5
    );

    const sleeveLength = getValue(
        'sleeve_length',
        8
    );

    const bodyLength = getValue(
        'length',
        27
    );

    /* Optional measurements */
    const waist = getValue(
        'waist',
        0
    );

    const hip = getValue(
        'hip',
        0
    );

    const inseam = getValue(
        'inseam',
        0
    );

    /* =========================================
       CALCULATE T-SHIRT GEOMETRY
    ========================================= */

    const tshirt = useMemo(() => {
        /*
         * These values control the visual
         * representation of the garment.
         *
         * They are proportional values,
         * not manufacturing pattern values.
         */

        const baseChest = 38;
        const baseLength = 27;
        const baseSleeve = 8;
        const baseShoulder = 16.5;

        /*
         * Body width responds to chest.
         */
        const bodyWidth =
            230 *
            (chest / baseChest);

        /*
         * Body height responds to body length.
         */
        const bodyHeight =
            330 *
            (bodyLength / baseLength);

        /*
         * Shoulder width responds to shoulder.
         */
        const shoulderWidth =
            220 *
            (shoulder / baseShoulder);

        /*
         * IMPORTANT:
         *
         * Sleeve length now controls how FAR
         * the sleeve extends horizontally.
         *
         * It does NOT control sleeve thickness.
         */
        const sleeveExtension =
            75 *
            (sleeveLength / baseSleeve);

        const centerX = 300;

        const leftBody =
            centerX -
            bodyWidth / 2;

        const rightBody =
            centerX +
            bodyWidth / 2;

        const top = 150;

        const bottom =
            top + bodyHeight;

        const shoulderLeft =
            centerX -
            shoulderWidth / 2;

        const shoulderRight =
            centerX +
            shoulderWidth / 2;

        return {
            bodyWidth,
            bodyHeight,
            shoulderWidth,
            sleeveExtension,
            centerX,
            leftBody,
            rightBody,
            top,
            bottom,
            shoulderLeft,
            shoulderRight,
        };
    }, [
        chest,
        shoulder,
        sleeveLength,
        bodyLength,
    ]);

    /* =========================================
       T-SHIRT SVG
    ========================================= */

    const renderTshirt = () => {
        const {
            bodyWidth,
            bodyHeight,
            sleeveExtension,
            centerX,
            leftBody,
            rightBody,
            top,
            bottom,
            shoulderLeft,
            shoulderRight,
        } = tshirt;

        /*
         * Sleeve depth stays visually constant.
         *
         * Sleeve LENGTH is represented by
         * horizontal extension.
         */
        const sleeveDepth = 55;

        const leftSleeveEnd =
            shoulderLeft -
            sleeveExtension;

        const rightSleeveEnd =
            shoulderRight +
            sleeveExtension;

        return (
            <svg
                className="tshirt-svg"
                viewBox="0 0 600 650"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="2D T-shirt fit preview"
            >

                {/* =================================
                    CHEST DIMENSION
                ================================= */}

                <line
                    x1={leftBody}
                    y1={top - 35}
                    x2={rightBody}
                    y2={top - 35}
                    className="dimension-line"
                />

                <line
                    x1={leftBody}
                    y1={top - 45}
                    x2={leftBody}
                    y2={top - 25}
                    className="dimension-tick"
                />

                <line
                    x1={rightBody}
                    y1={top - 45}
                    x2={rightBody}
                    y2={top - 25}
                    className="dimension-tick"
                />

                <text
                    x={centerX}
                    y={top - 52}
                    className="dimension-label"
                    textAnchor="middle"
                >
                    Chest {chest.toFixed(1)}"
                </text>

                {/* =================================
                    SHOULDER DIMENSION
                ================================= */}

                <line
                    x1={shoulderLeft}
                    y1={top - 75}
                    x2={shoulderRight}
                    y2={top - 75}
                    className="dimension-line"
                />

                <line
                    x1={shoulderLeft}
                    y1={top - 85}
                    x2={shoulderLeft}
                    y2={top - 65}
                    className="dimension-tick"
                />

                <line
                    x1={shoulderRight}
                    y1={top - 85}
                    x2={shoulderRight}
                    y2={top - 65}
                    className="dimension-tick"
                />

                <text
                    x={centerX}
                    y={top - 92}
                    className="dimension-label"
                    textAnchor="middle"
                >
                    Shoulder {shoulder.toFixed(1)}"
                </text>

                {/* =================================
                    LEFT SLEEVE
                ================================= */}

                <path
                    d={`
                        M ${shoulderLeft} ${top}
                        L ${leftSleeveEnd} ${top + 28}
                        L ${leftSleeveEnd + 8}
                            ${top + sleeveDepth}
                        L ${leftBody}
                            ${top + 68}
                        L ${leftBody}
                            ${top + 55}
                        Z
                    `}
                    className="tshirt-sleeve"
                />

                {/* =================================
                    RIGHT SLEEVE
                ================================= */}

                <path
                    d={`
                        M ${shoulderRight} ${top}
                        L ${rightSleeveEnd} ${top + 28}
                        L ${rightSleeveEnd - 8}
                            ${top + sleeveDepth}
                        L ${rightBody}
                            ${top + 68}
                        L ${rightBody}
                            ${top + 55}
                        Z
                    `}
                    className="tshirt-sleeve"
                />

                {/* =================================
                    MAIN T-SHIRT BODY
                ================================= */}

                <path
                    d={`
                        M ${shoulderLeft} ${top}

                        L ${leftBody}
                            ${top + 55}

                        L ${leftBody}
                            ${bottom}

                        L ${rightBody}
                            ${bottom}

                        L ${rightBody}
                            ${top + 55}

                        L ${shoulderRight}
                            ${top}

                        L ${shoulderRight - 45}
                            ${top - 20}

                        L ${centerX + 32}
                            ${top - 5}

                        Q ${centerX}
                            ${top + 35}
                            ${centerX - 32}
                            ${top - 5}

                        L ${shoulderLeft + 45}
                            ${top - 20}

                        Z
                    `}
                    className="tshirt-body"
                />

                {/* =================================
                    NECKLINE
                ================================= */}

                <path
                    d={`
                        M ${centerX - 32}
                            ${top - 5}

                        Q ${centerX}
                            ${top + 38}
                            ${centerX + 32}
                            ${top - 5}
                    `}
                    className="tshirt-neck"
                />

                {/* =================================
                    BODY CENTER LINE
                ================================= */}

                <line
                    x1={centerX}
                    y1={top + 55}
                    x2={centerX}
                    y2={bottom - 15}
                    className="center-line"
                />

                {/* =================================
                    BODY LENGTH DIMENSION
                ================================= */}

                <line
                    x1={rightBody + 60}
                    y1={top}
                    x2={rightBody + 60}
                    y2={bottom}
                    className="dimension-line"
                />

                <line
                    x1={rightBody + 50}
                    y1={top}
                    x2={rightBody + 70}
                    y2={top}
                    className="dimension-tick"
                />

                <line
                    x1={rightBody + 50}
                    y1={bottom}
                    x2={rightBody + 70}
                    y2={bottom}
                    className="dimension-tick"
                />

                <text
                    x={rightBody + 82}
                    y={
                        (top + bottom) / 2
                    }
                    className="dimension-label"
                    textAnchor="middle"
                    transform={`
                        rotate(
                            90
                            ${rightBody + 82}
                            ${(top + bottom) / 2}
                        )
                    `}
                >
                    Body Length {bodyLength.toFixed(1)}"
                </text>

                {/* =================================
                    SLEEVE LENGTH DIMENSION
                ================================= */}

                <line
                    x1={shoulderLeft}
                    y1={top + 95}
                    x2={leftSleeveEnd}
                    y2={top + 95}
                    className="dimension-line"
                />

                <line
                    x1={shoulderLeft}
                    y1={top + 87}
                    x2={shoulderLeft}
                    y2={top + 103}
                    className="dimension-tick"
                />

                <line
                    x1={leftSleeveEnd}
                    y1={top + 87}
                    x2={leftSleeveEnd}
                    y2={top + 103}
                    className="dimension-tick"
                />

                <text
                    x={
                        (
                            shoulderLeft +
                            leftSleeveEnd
                        ) / 2
                    }
                    y={top + 120}
                    className="dimension-label"
                    textAnchor="middle"
                >
                    Sleeve {sleeveLength.toFixed(1)}"
                </text>
            </svg>
        );
    };

    /* =========================================
       EMPTY STATE
    ========================================= */

    if (
        !measurements ||
        measurements.length === 0
    ) {
        return (
            <div className="size-adjuster">
                <div className="empty-state">
                    No measurements are available
                    for this size.
                </div>
            </div>
        );
    }

    return (
        <div className="size-adjuster">

            {/* =================================
                MAIN BORDERED PANEL
            ================================= */}

            <div className="size-adjuster-panel">

                {/* =================================
                    LEFT: 2D PREVIEW
                ================================= */}

                <section className="preview-panel">

                    <div className="panel-heading">
                        <h3>
                            2D Fit Preview
                        </h3>

                        <span>
                            Updates in real time
                        </span>
                    </div>

                    <div className="preview-canvas">
                        {renderTshirt()}
                    </div>

                    {/* =================================
                        CURRENT VALUES
                    ================================= */}

                    <div className="preview-values">

                        <div>
                            <span>
                                Chest
                            </span>

                            <strong>
                                {chest.toFixed(1)}
                                {' '}
                                in
                            </strong>
                        </div>

                        <div>
                            <span>
                                Shoulder
                            </span>

                            <strong>
                                {shoulder.toFixed(1)}
                                {' '}
                                in
                            </strong>
                        </div>

                        <div>
                            <span>
                                Sleeve
                            </span>

                            <strong>
                                {sleeveLength.toFixed(1)}
                                {' '}
                                in
                            </strong>
                        </div>

                        <div>
                            <span>
                                Length
                            </span>

                            <strong>
                                {bodyLength.toFixed(1)}
                                {' '}
                                in
                            </strong>
                        </div>

                    </div>
                </section>

                {/* =================================
                    RIGHT: ADJUSTMENTS
                ================================= */}

                <section className="controls-panel">

                    <div className="panel-heading">

                        <h3>
                            Adjust Measurements
                        </h3>

                        <p>
                            Move the sliders to
                            customize your fit.
                        </p>

                    </div>

                    <div className="sliders-container">

                        {(measurements || []).map(
                            (m) => {
                                const key =
                                    getMeasurementKey(
                                        m
                                    );

                                const adjustment =
                                    Number(
                                        adjustments[
                                        key
                                        ] ?? 0
                                    );

                                const baseValue =
                                    Number(
                                        m.value
                                    );

                                const finalValue =
                                    baseValue +
                                    adjustment;

                                const unit =
                                    m?.measurementType
                                        ?.unit ||
                                    'inch';

                                const label =
                                    m?.measurementType
                                        ?.label ||
                                    m?.measurementType
                                        ?.key ||
                                    'Measurement';

                                return (
                                    <div
                                        className="slider-row"
                                        key={
                                            m.id ||
                                            key
                                        }
                                    >

                                        <div className="slider-top">

                                            <div>
                                                <label>
                                                    {
                                                        label
                                                    }
                                                </label>

                                                <small>
                                                    Base:{' '}
                                                    {baseValue.toFixed(
                                                        1
                                                    )}{' '}
                                                    {
                                                        unit
                                                    }
                                                </small>
                                            </div>

                                            <strong>
                                                {finalValue.toFixed(
                                                    1
                                                )}{' '}
                                                {unit}
                                            </strong>

                                        </div>

                                        <div className="slider-control">

                                            <span>
                                                -4
                                            </span>

                                            <input
                                                type="range"
                                                min="-4"
                                                max="4"
                                                step="0.5"
                                                value={
                                                    adjustment
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleChange(
                                                        key,
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                aria-label={`Adjust ${label}`}
                                            />

                                            <span>
                                                +4
                                            </span>

                                        </div>

                                        <div className="adjustment-text">

                                            {adjustment ===
                                                0
                                                ? 'No adjustment'
                                                : adjustment >
                                                    0
                                                    ? `+${adjustment.toFixed(
                                                        1
                                                    )} ${unit}`
                                                    : `${adjustment.toFixed(
                                                        1
                                                    )} ${unit}`}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    {/* =================================
                        BUTTONS
                    ================================= */}

                    <div className="controls-footer">

                        <button
                            type="button"
                            className="reset-button"
                            onClick={
                                resetAdjustments
                            }
                        >
                            Reset
                        </button>

                        <button
                            type="button"
                            className="save-button"
                            onClick={
                                handleSave
                            }
                        >
                            Save Measurements
                        </button>

                    </div>

                </section>
            </div>
        </div>
    );
}

export default SizeAdjuster;