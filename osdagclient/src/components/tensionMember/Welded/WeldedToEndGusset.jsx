import "../../../App.css";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Select, Input, Modal, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

// Import assets
// import AngleImg from "../../../assets/TensionMember/welded_to_end_gusset/angle.png";
// import LongLegImg from "../../../assets/TensionMember/welded_to_end_gusset/long_leg.png";
import AngleImg from '../../../assets/ShearConnection/sc_fin_plate/fin_cf_bw.png'
import LongLegImg from '../../../assets/ShearConnection/sc_fin_plate/fin_cf_bw.png'
import ErrorImg from "../../../assets/notSelected.png";
import cad_background from "../../../assets/cad_empty_image.png";

// Import components
import OutputDock from "./OutputDock";
import Logs from "../../Logs";
import { Canvas } from "@react-three/fiber";
import Model from "../../shearConnection/threerender";
import { ModuleContext } from "../../../context/ModuleState";
import { Viewer } from "@react-pdf-viewer/core";
import DesignPrefSections from "../../DesignPrefSections";
import CustomSectionModal from "../../CustomSectionModal";

// Import dropdown menu
import DropdownMenu from "../../DropdownMenu";

// Import menu data
import menuData from "../../../assets/menu_data/menuItems.json";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";

const { Option } = Select;

function WeldedToEndGusset() {
  console.log('Welded To End Gusset component is opening');
  const { MenuItems } = menuData;

  const [selectedOption, setSelectedOption] = useState("Angles");
  const [connLocationSelected, setConnLocationSelected] = useState("Long Leg");
  const [imageSource, setImageSource] = useState(AngleImg);
  const [isModalOpen, setModalOpen] = useState(false);
  const [output, setOutput] = useState(null);
  const [logs, setLogs] = useState(null);
  const [displayOutput, setDisplayOutput] = useState(false);
  const [designPrefModalStatus, setDesignPrefModalStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [displaySaveInputPopup, setDisplaySaveInputPopup] = useState(false);
  const [saveInputFileName, setSaveInputFileName] = useState("");
  const [renderBoolean, setRenderBoolean] = useState(false);
  const [CreateDesignReportBool, setCreateDesignReportBool] = useState(false);

  const {
    sectionProfileList = ["Angles", "Channels", "I-Sections"],
    connLocationList = ["Long Leg", "Short Leg", "Web", "Flange"],
    sectionList = ["ISA 30X20X3", "ISA 40X25X4", "ISA 45X30X5", "ISA 60X40X5", "ISA 65X45X6", "ISA 75X50X6"],
    materialList = [{id: 1, Grade: "E 165 (Fe 290)"}, {id: 2, Grade: "E 250 (Fe 410 W)A"}, {id: 3, Grade: "E 300 (Fe 440)"}],
    plateThicknessList = ["All", "6", "8", "10", "12", "16", "20", "25"],
    designLogs,
    designData,
    displayPDF,
    renderCadModel,
    createSession,
    createDesign,
    createDesignReport,
    getDesingPrefData,
    deleteSession
  } = useContext(ModuleContext) || {};

  // If displaySaveInputPopup is true, set a timeout to hide it after 4 seconds
  if (displaySaveInputPopup)
    [setTimeout(() => setDisplaySaveInputPopup(false), 4000)];

  const [inputs, setInputs] = useState({
    module: "Welded To End Gusset",
    section_profile: "Angles",
    conn_location: "Long Leg",
    section_designation: "ISA 60X40X5",
    material: "E 165 (Fe 290)",
    length: "",
    load_axial: "",
    plate_thickness: "All"
  });

  const [designReportInputs, setDesignReportInputs] = useState({
    companyName: "Your company",
    groupTeamName: "Your team",
    designer: "You",
    projectTitle: "",
    subtitle: "",
    jobNumber: "1",
    client: "Someone else",
    additionalComments: "No comments",
    companyLogo: null,
    companyLogoName: "",
  });

  useEffect(() => {
    createSession("Welded To End Gusset");
  }, []);

  useEffect(() => {
    return () => {
      if(location.pathname!="/design/tension/welded_to_end_gusset"){
        deleteSession('Welded To End Gusset');
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedOption) return;

    if (selectedOption === "Angles") {
      setImageSource(AngleImg);
      // Update connection location options based on profile
      setConnLocationSelected("Long Leg");
    } else if (selectedOption === "Channels") {
      setImageSource(ErrorImg); // Replace with actual channel image
      setConnLocationSelected("Web");
    } else if (selectedOption === "I-Sections") {
      setImageSource(ErrorImg); // Replace with actual I-section image
      setConnLocationSelected("Web");
    } else {
      setImageSource(ErrorImg);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption === "Angles") {
      if (connLocationSelected === "Long Leg") {
        setImageSource(LongLegImg);
      } else if (connLocationSelected === "Short Leg") {
        setImageSource(AngleImg);
      }
    }
  }, [connLocationSelected, selectedOption]);

  const handleSectionProfileChange = (value) => {
    setOutput(null);
    setSelectedOption(value);
    setInputs({...inputs, section_profile: value});
    
    // Update connection location based on profile
    if (value === "Angles") {
      setConnLocationSelected("Long Leg");
      setInputs({...inputs, section_profile: value, conn_location: "Long Leg"});
    } else {
      setConnLocationSelected("Web");
      setInputs({...inputs, section_profile: value, conn_location: "Web"});
    }
  };

  const handleConnLocationChange = (value) => {
    setConnLocationSelected(value);
    setInputs({...inputs, conn_location: value});
  };

  useEffect(() => {
    if (displayOutput) {
      try {
        setLogs(designLogs);
      } catch (error) {
        console.log(error);
        setOutput(null);
      }
    }
  }, [designLogs]);

  useEffect(() => {
    if (displayOutput) {
      try {
        const formatedOutput = {};

        for (const [key, value] of Object.entries(designData || {})) {
          const newKey = key.split(".")[0];
          const label = value.label;
          const val = value.value;

          if (val) {
            if (!formatedOutput[newKey])
              formatedOutput[newKey] = [{ label, val }];
            else formatedOutput[newKey].push({ label, val });
          }
        }

        setOutput(formatedOutput);
      } catch (error) {
        console.log(error);
        setOutput(null);
      }
    }
  }, [designData]);

  const handleSubmit = async () => {
    if (!inputs.section_designation || !inputs.material || !inputs.load_axial || !inputs.length) {
      alert("Please input all the required fields");
      return;
    }

    const param = {
      "Module": "Welded To End Gusset",
      "Section.Profile": inputs.section_profile,
      "Section.Connection_Location": inputs.conn_location,
      "Section.Designation": inputs.section_designation,
      "Material": inputs.material,
      "Member.Length": inputs.length,
      "Load.Axial": inputs.load_axial,
      "Plate.Thickness": inputs.plate_thickness,
    };
    
    createDesign(param, "Welded-To-End-Gusset");
    setDisplayOutput(true);
  };

  const handleReset = () => {
    setInputs({
      module: "Welded To End Gusset",
      section_profile: "Angles",
      conn_location: "Long Leg",
      section_designation: "ISA 60X40X5",
      material: "E 165 (Fe 290)",
      length: "",
      load_axial: "",
      plate_thickness: "All"
    });
    
    setSelectedOption("Angles");
    setConnLocationSelected("Long Leg");
    
    // Reset CAD model
    setRenderBoolean(false);
    
    // Reset Output values dock
    setOutput(null);
    setDisplayOutput(false);
  };

  const convertToCSV = (data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const csvData = keys.map((key, index) => {
      const escapedValue = values[index].toString().replace(/"/g, '\\"');
      return `"${key}","${escapedValue}"`;
    });

    return csvData.join("\n");
  };

  const saveOutput = () => {
    if (!output) {
      alert("Please submit the design first.");
      return;
    }

    let data = {
      "Module": "Welded To End Gusset",
      "Section.Profile": inputs.section_profile,
      "Section.Connection_Location": inputs.conn_location,
      "Section.Designation": inputs.section_designation,
      "Material": inputs.material,
      "Member.Length": inputs.length,
      "Load.Axial": inputs.load_axial,
      "Plate.Thickness": inputs.plate_thickness,
    };

    Object.keys(output).map((key) => {
      Object.values(output[key]).map((elm) => {
        data[key + "." + elm.label.split(" ").join("_")] = elm.val;
      });
    });

    data = convertToCSV(data);
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(data);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "output.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = () => {
    setCreateDesignReportBool(false);
  };

  const handleOk = () => {
    if (!output) {
      alert("Please submit the design first.");
      return;
    }
    
    createDesignReport(designReportInputs);
    handleCancelProfile();
  };

  const handleCancelProfile = () => {
    setDesignReportInputs({
      companyName: "Your company",
      groupTeamName: "Your team",
      designer: "You",
      projectTitle: "",
      subtitle: "",
      jobNumber: "1",
      client: "Someone else",
      additionalComments: "No comments",
      companyLogo: null,
      companyLogoName: "",
    });
    setCreateDesignReportBool(false);
  };

  const handleCreateDesignReport = () => {
    setCreateDesignReportBool(true);
  };

  const handleImageFileChange = (event) => {
    const imageFile = event.target.files[0];
    let imageFileName = event.target.files[0].name;

    setDesignReportInputs({
      ...designReportInputs,
      companyLogo: imageFile,
      companyLogoName: imageFileName,
    });
  };

  useEffect(() => {
    if (renderCadModel) {
      setRenderBoolean(true);
    } else {
      setRenderBoolean(false);
    }
  }, [renderCadModel]);

  useEffect(() => {
    const designPrefHandler = (e) => {
      if (e.altKey && e.key == "p") {
        setDesignPrefModalStatus(true);
      }
    };

    window.addEventListener("keydown", designPrefHandler);
    return () => {
      setDesignPrefModalStatus(false);
      window.removeEventListener("keydown", designPrefHandler);
    };
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className="module_nav">
          {MenuItems.map((item, index) => (
            <DropdownMenu
              key={index}
              label={item.label}
              dropdown={item.dropdown}
              setDesignPrefModalStatus={setDesignPrefModalStatus}
              inputs={inputs}
              setInputs={setInputs}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              logs={logs}
              setCreateDesignReportBool={setCreateDesignReportBool}
              setDisplaySaveInputPopup={setDisplaySaveInputPopup}
              setSaveInputFileName={setSaveInputFileName}
            />
          ))}

          {displaySaveInputPopup && (
            <span id="save-input-style" style={{ marginTop: "18px" }}>
              <strong>
                Saved input file as &quot; {saveInputFileName} &quot;
              </strong>
            </span>
          )}

          <h1 className="element">
            <Button
              onClick={() => {
                navigate("/home");
              }}
              style={{ backgroundColor: "black", color: "white" }}
            >
              Home
            </Button>
          </h1>
        </div>

        {/* Main Body of code  */}
        <div className="superMainBody">
          {/* Left - Input Dock */}
          <div>
            <h5>Input Dock</h5>
            <div className="subMainBody scroll-data">
              {/* Connecting Members Section */}
              <h3>Connecting Members</h3>
              <div className="component-grid">
                <div>
                  <h4>Section Profile*</h4>
                </div>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    onSelect={handleSectionProfileChange}
                    value={selectedOption}
                  >
                    {sectionProfileList?.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>{/*Blank*/}</div>

                <div>
                  <img
                    src={imageSource}
                    alt="Component"
                    height="100px"
                    width="100px"
                  />
                </div>

                <div>
                  <h4>Conn. Location *</h4>
                </div>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    value={connLocationSelected}
                    onSelect={handleConnLocationChange}
                    disabled={selectedOption !== "Angles"}
                  >
                    {selectedOption === "Angles" ? 
                      ["Long Leg", "Short Leg"].map((item, index) => (
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      )) : 
                      ["Web", "Flange"].map((item, index) => (
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      ))
                    }
                  </Select>
                </div>

                <div>
                  <h4>Section Designation*</h4>
                </div>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    value={inputs.section_designation}
                    onSelect={(value) =>
                      setInputs({ ...inputs, section_designation: value })
                    }
                  >
                    {sectionList?.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <h4>Material *</h4>
                </div>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    value={inputs.material}
                    onSelect={(value) => {
                      if (value == -1) {
                        setShowModal(true);
                        return;
                      }
                      const material = materialList.find(
                        (item) => item.id === value
                      );
                      setInputs({
                        ...inputs,
                        material: material.Grade,
                      });
                    }}
                  >
                    {materialList?.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.Grade}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <h4>Length (mm) *</h4>
                </div>
                <div>
                  <Input
                    type="text"
                    value={inputs.length}
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      );
                    }}
                    onChange={(event) =>
                      setInputs({ ...inputs, length: event.target.value })
                    }
                  />
                </div>
              </div>

              {/* Factored Loads Section */}
              <h3>Factored Loads</h3>
              <div className="component-grid">
                <div>
                  <h4>Axial Force (kN)*</h4>
                </div>
                <div>
                  <Input
                    type="text"
                    value={inputs.load_axial}
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      );
                    }}
                    onChange={(event) =>
                      setInputs({ ...inputs, load_axial: event.target.value })
                    }
                  />
                </div>
              </div>

              {/* Plate Section */}
              <h3>Plate</h3>
              <div className="component-grid">
                <div>
                  <h4>Thickness (mm) *</h4>
                </div>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    value={inputs.plate_thickness}
                    onSelect={(value) =>
                      setInputs({ ...inputs, plate_thickness: value })
                    }
                  >
                    {plateThicknessList?.map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="inputdock-btn">
              <Input
                type="button"
                value="Reset"
                onClick={handleReset}
              />
              <Input
                type="button"
                value="Design"
                onClick={handleSubmit}
              />
            </div>
          </div>

          {/* Middle - CAD Model and Logs */}
          <div className="superMainBody_mid">
            {renderBoolean ? (
              <div
                style={{
                  maxwidth: "740px",
                  height: "600px",
                  border: "1px solid black",
                  backgroundImage: `url(${cad_background})`,
                }}
              >
                <Canvas
                  gl={{ antialias: true }}
                  camera={{ aspect: 1, fov: 1500, position: [10, 10, 10] }}
                >
                  <Model />
                </Canvas>
              </div>
            ) : (
              <div
                style={{
                  maxwidth: "740px",
                  height: "600px",
                  border: "1px solid black",
                }}
              >
                <img
                  src={cad_background}
                  alt="Demo"
                  height="100%"
                  width="100%"
                />
              </div>
            )}
            <br />
            <div>
              <Logs logs={logs} />
            </div>
          </div>

          {/* Right - Output Dock */}
          <div>
            <OutputDock 
              output={output} 
              connectionType={"Welded To End Gusset"}
              sections={[
                { title: "Section Details", fields: ["Designation", "Tension Yielding Capacity (kN)", "Tension Rupture Capacity (kN)", "Tension Capacity (kN)", "Slenderness ratio", "Utilization Ratio"] },
                { title: "End Connection", fields: [] },
                { title: "Weld Details", fields: ["Type", "Size (mm)", "Strength (N/mm²)", "Long Joint Red.Factor", "Red.Strength (N/mm)", "Stress (N/mm)", "Eff.Length (mm)"] },
                { title: "Gusset Plate Details", fields: ["Thickness (mm)", "Min.Height (mm)", "Min.Plate Length (mm)", "Tension Yielding Capacity (kN)"] }
              ]}
            />
            <div className="outputdock-btn">
              <Input
                type="button"
                value="Create Design Report"
                onClick={handleCreateDesignReport}
              />
              <Input 
                type="button" 
                value="Save Output" 
                onClick={saveOutput} 
              />

              <Modal
                open={CreateDesignReportBool}
                onCancel={handleCancel}
                footer={null}
                style={{ border: "1px solid #ccc" }}
                bodyStyle={{ padding: "20px" }}
              >
                <div>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Company Name:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        id="companyName"
                        value={designReportInputs.companyName}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Company Logo : </label>
                    </Col>
                    <Col span={15}>
                      <input
                        type="file"
                        accept="image/png , image/jpeg , image/jpg"
                        value={setDesignReportInputs.companyLogoName}
                        onChange={handleImageFileChange}
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Group/Team Name:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        id="groupTeamName"
                        value={designReportInputs.groupTeamName}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            groupTeamName: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Designer:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        id="designer"
                        value={designReportInputs.designer}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            designer: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Project Title:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        value={designReportInputs.projectTitle}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            projectTitle: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Subtitle:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        value={designReportInputs.subtitle}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            subtitle: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Job Number:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        value={designReportInputs.jobNumber}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            jobNumber: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Client:</label>
                    </Col>
                    <Col span={15}>
                      <Input
                        value={designReportInputs.client}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            client: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "25px" }}
                  >
                    <Col span={9}>
                      <label>Additional Comments:</label>
                    </Col>
                    <Col span={15}>
                      <Input.TextArea
                        value={designReportInputs.additionalComments}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            additionalComments: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <Button type="button" onClick={handleOk}>
                      OK
                    </Button>
                    <Button type="button" onClick={handleCancelProfile}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal>

              {/* Design Preferences Modal */}
              {designPrefModalStatus && (
                <Modal
                  open={designPrefModalStatus}
                  onCancel={() => setConfirmationModal(true)}
                  footer={null}
                  minWidth={1200}
                  width={1400}
                  maxHeight={1200}
                  maskClosable={false}
                >
                  <DesignPrefSections
                    inputs={inputs}
                    setInputs={setInputs}
                    selectedOption={selectedOption}
                    setDesignPrefModalStatus={setDesignPrefModalStatus}
                    confirmationModal={confirmationModal}
                    setConfirmationModal={setConfirmationModal}
                  />
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomSectionModal
        showModal={showModal}
        setShowModal={setShowModal}
        setInputValues={setInputs}
        inputValues={inputs}
        type="material"
      />

      {displayPDF ? (
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "750px",
            position: "absolute",
          }}
        >
          <Viewer
            fileUrl={`http://localhost:5173/00335c94-1b3f-47f1-959e-6b96475dfd38`}
          />
        </div>
      ) : null}
    </>
  );
}

export default WeldedToEndGusset;