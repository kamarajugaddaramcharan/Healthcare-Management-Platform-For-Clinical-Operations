import {
    Heart,
    Activity,
    Droplets,
    Thermometer,
    Ruler,
    Weight,
    Candy,
} from "lucide-react";

function VitalsGrid({ twin }) {

    const heartRate =
        twin?.heartRate;

    const bloodPressure =
        twin?.bloodPressure;

    const oxygenLevel =
        twin?.oxygenLevel ??
        twin?.spo2;

    const temperature =
        twin?.temperature;

    const height =
        twin?.height;

    const weight =
        twin?.weight;

    const bloodSugar =
        twin?.bloodSugar;

    const formatValue = (
        value,
        suffix = ""
    ) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "--";
        }

        return `${value}${suffix}`;
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                gap: 16,
            }}
        >

            {/* HEART RATE */}

            <VitalCard
                icon={
                    <Heart
                        size={26}
                    />
                }
                iconColor="#ef4444"
                iconBackground="#fee2e2"
                title="Heart Rate"
                value={formatValue(
                    heartRate,
                    " BPM"
                )}
                live
            />

            {/* BLOOD PRESSURE */}

            <VitalCard
                icon={
                    <Activity
                        size={26}
                    />
                }
                iconColor="#2563eb"
                iconBackground="#dbeafe"
                title="Blood Pressure"
                value={formatValue(
                    bloodPressure
                )}
                live
            />

            {/* SPO2 */}

            <VitalCard
                icon={
                    <Droplets
                        size={26}
                    />
                }
                iconColor="#16a34a"
                iconBackground="#dcfce7"
                title="SpO₂"
                value={formatValue(
                    oxygenLevel,
                    "%"
                )}
                live
            />

            {/* TEMPERATURE */}

            <VitalCard
                icon={
                    <Thermometer
                        size={26}
                    />
                }
                iconColor="#f97316"
                iconBackground="#ffedd5"
                title="Temperature"
                value={formatValue(
                    temperature,
                    "°C"
                )}
                live
            />

            {/* HEIGHT */}

            <VitalCard
                icon={
                    <Ruler
                        size={26}
                    />
                }
                iconColor="#8b5cf6"
                iconBackground="#ede9fe"
                title="Height"
                value={formatValue(
                    height,
                    " cm"
                )}
                live={false}
            />

            {/* WEIGHT */}

            <VitalCard
                icon={
                    <Weight
                        size={26}
                    />
                }
                iconColor="#0891b2"
                iconBackground="#cffafe"
                title="Weight"
                value={formatValue(
                    weight,
                    " kg"
                )}
                live={false}
            />

            {/* BLOOD SUGAR */}

            <VitalCard
                icon={
                    <Candy
                        size={26}
                    />
                }
                iconColor="#ec4899"
                iconBackground="#fce7f3"
                title="Blood Sugar"
                value={formatValue(
                    bloodSugar,
                    " mg/dL"
                )}
                live={false}
            />

        </div>
    );
}


// =========================================================
// VITAL CARD
// =========================================================

function VitalCard({
                       icon,
                       iconColor,
                       iconBackground,
                       title,
                       value,
                       live,
                   }) {

    return (
        <div
            style={{
                position: "relative",
                background:
                    "#f8fafc",
                border:
                    "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 18,
                minHeight: 130,
            }}
        >

            {/* LIVE */}

            {live && (
                <div
                    style={{
                        position:
                            "absolute",
                        top: 18,
                        right: 18,
                        background:
                        iconColor,
                        color: "#fff",
                        padding:
                            "5px 11px",
                        borderRadius:
                            "999px",
                        fontSize: 12,
                        fontWeight: 700,
                    }}
                >
                    Live
                </div>
            )}

            {/* ICON */}

            <div
                style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background:
                    iconBackground,
                    color:
                    iconColor,
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    marginBottom: 15,
                }}
            >
                {icon}
            </div>

            {/* TITLE */}

            <div
                style={{
                    color: "#64748b",
                    fontSize: 14,
                    marginBottom: 8,
                }}
            >
                {title}
            </div>

            {/* VALUE */}

            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0f172a",
                }}
            >
                {value}
            </div>

        </div>
    );
}

export default VitalsGrid;