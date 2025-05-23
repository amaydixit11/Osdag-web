/* eslint-disable no-unused-vars */
import "../../App.css";
import {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  Suspense,
} from "react";
import "react-toastify/dist/ReactToastify.css";
import { Select, Input, Modal, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
// Import connection type images - you'll need to add these to assets
// import SingleAngle from "../../assets/TensionMember/welded_to_end_gusset/single_angle.png";
// import DoubleAngle from "../../assets/TensionMember/welded_to_end_gusset/double_angle.png";
import SingleAngle from "../../assets/ShearConnection/sc_fin_plate/fin_cf_bw.png";
import DoubleAngle from "../../assets/ShearConnection/sc_fin_plate/fin_cf_bw.png";
import Channel from "../../assets/ShearConnection/sc_fin_plate/fin_cf_bw.png";
// import Channel from "../../assets/TensionMember/welded_to_end_gusset/channel.png";
import ErrorImg from "../../assets/notSelected.png";
import WeldedToEndGussetOutputDock from "./OutputDock";
import Logs from "../Logs";
import Model from "./threerender";
import { Canvas } from "@react-three/fiber";
import { ModuleContext } from "../../context/ModuleState";
import { Viewer } from "@react-pdf-viewer/core";
import { Transfer } from "antd";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

// import assets
import cad_background from "../../assets/cad_empty_image.png";
import { Html, Tube } from "@react-three/drei";
import DesignPrefSections from "../DesignPrefSections";
import CustomSectionModal from "../CustomSectionModal";

// drop down
import DropdownMenu from "../DropdownMenu";

// crypto packages
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { UserContext } from "../../context/UserState";
import { useLocation } from "react-router-dom";
import ScreenshotCapture from "../ScreenShotCapture";

const { Option } = Select;

const conn_map = {
  "Single Angle": "Single Angle",
  "Double Angle": "Double Angle",
  "Channel": "Channel",
};

const MenuItems = [
  {
    label: "File",
    dropdown: [
      { name: "Load Input", shortcut: "Ctrl+L" },
      { name: "Save Input", shortcut: "Alt+N" },
      { name: "Download Input", shortcut: "Alt+D" },
      { name: "Save Log Messages", shortcut: "Alt+M" },
      { name: "Create Design Report", shortcut: "Alt+C" },
      { name: "Save 3D Model", shortcut: "Alt+3" },
      { name: "Save Cad Image", shortcut: "Alt+1" },
    ],
  },
  {
    label: "Edit",
    dropdown: [{ name: "Design Preferences", shortcut: "Alt+P" }],
  },
  {
    label: "Graphics",
    dropdown: [
      { name: "Zoom In", shortcut: "Ctrl+I" },
      { name: "Zoom Out", shortcut: "Ctrl+O" },
      { name: "Pan", shortcut: "Ctrl+P" },
      { name: "Rotate 3D Model", shortcut: "Ctrl+R" },
      { name: "Model" },
      { name: "Member" },
      { name: "Gusset" },
      { name: "Weld" },
      { name: "Change Background" },
    ],
  },
  {
    label: "Database",
    dropdown: [
      { name: "Downloads", options: ["Angle", "Channel", "Plate"] },
      { name: "Reset" },
    ],
  },
  {
    label: "Help",
    dropdown: [
      { name: "Video Tutorials" },
      { name: "Design Examples" },
      { name: "Ask us a question" },
      { name: "About Osdag" },
    ],
  },
];

function WeldedToEndGusset() {
  const [selectedOption, setSelectedOption] = useState("Single Angle");
  const [imageSource, setImageSource] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [output, setOutput] = useState(null);
  const [logs, setLogs] = useState(null);
  const [displayOutput, setDisplayOutput] = useState();
  const [plateThicknessSelect, setPlateThicknessSelect] = useState("All");
  const [designPrefModalStatus, setDesignPrefModalStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [displaySaveInputPopup, setDisplaySaveInputPopup] = useState(false);
  const [saveInputFileName, setSaveInputFileName] = useState("");
  const {
    connectivityList,
    beamList,
    columnList,
    angleList,
    channelList,
    materialList,
    plateThicknessList,
    designLogs,
    designData,
    displayPDF,
    renderCadModel,
    cadModelPaths,
    createSession,
    createDesign,
    createDesignReport,
    getDesingPrefData,
    deleteSession,
  } = useContext(ModuleContext);

  if (displaySaveInputPopup)
    [setTimeout(() => setDisplaySaveInputPopup(false), 4000)];

  const [inputs, setInputs] = useState({
    tension_member_section: "L 50 x 50 x 5",
    gusset_plate_thickness: [],
    member_material: "E 250 (Fe 410 W)A",  
    gusset_material: "E 250 (Fe 410 W)A",
    load_tension: "100",
    module: "Welded to End Gusset",
    weld_type: "Fillet Weld",
    weld_size: "6",
    weld_fab: "Shop Weld",
    weld_material_grade: "410",
    detailing_edge_type: "Rolled, machine-flame cut, sawn and planed",
    detailing_corr_status: "No",
    design_method: "Limit State Design",
    connection_length: "150",
  });

  const [plateThicknessModal, setPlateThicknessModal] = useState(false);
  const [allSelected, setAllSelected] = useState({
    gusset_plate_thickness: true,
  });

  const [renderBoolean, setRenderBoolean] = useState(false);
  const [modelKey, setModelKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedView, setSelectedView] = useState("Model");
  const options = ["Model", "Member", "Gusset", "Weld"];
  const [screenshotTrigger, setScreenshotTrigger] = useState(false);
  const triggerScreenshotCapture = () => {
    setScreenshotTrigger(true);
  };

  useEffect(() => {
    createSession("Welded to End Gusset");
  }, []);

  useEffect(() => {
    return () => {
      if (location.pathname != "/design/tension_members/welded_to_end_gusset") {
        deleteSession("Welded to End Gusset");
      }
    };
  }, []);

  const handleAllSelectPT = (value) => {
    if (value === "Customized") {
      if (inputs.gusset_plate_thickness.length != 0) {
        setInputs({ ...inputs, gusset_plate_thickness: inputs.gusset_plate_thickness });
      } else {
        setInputs({ ...inputs, gusset_plate_thickness: [] });
      }
      setPlateThicknessSelect("Customized");
      setAllSelected({ ...allSelected, gusset_plate_thickness: false });
      setPlateThicknessModal(true);
    } else {
      setPlateThicknessSelect("All");
      setAllSelected({ ...allSelected, gusset_plate_thickness: true });
      setPlateThicknessModal(false);
    }
  };

  useEffect(() => {
    if (!selectedOption) return;

    if (selectedOption === "Single Angle") {
      setImageSource(SingleAngle);
    } else if (selectedOption === "Double Angle") {
      setImageSource(DoubleAngle);
    } else if (selectedOption === "Channel") {
      setImageSource(Channel);
    } else if (selectedOption === "") {
      setImageSource(ErrorImg);
    }
  }, [selectedOption]);

  const handleSelectChange = (value) => {
    setOutput(null);
    setSelectedOption(value);
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

        for (const [key, value] of Object.entries(designData)) {
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
    let param = {};
    
    if (!inputs.tension_member_section || inputs.tension_member_section === "Select Section") {
      alert("Please input all the fields");
      return;
    }

    param = {
      "Connection.Type": conn_map[selectedOption],
      "Member.Section.Designation": inputs.tension_member_section,
      "Member.Material": inputs.member_material,
      "Gusset.Material": inputs.gusset_material,
      "Gusset.Plate.Thickness_List": allSelected.gusset_plate_thickness
        ? plateThicknessList
        : inputs.gusset_plate_thickness,
      "Load.Tension": inputs.load_tension || "",
      "Weld.Type": inputs.weld_type,
      "Weld.Size": inputs.weld_size,
      "Weld.Fab": inputs.weld_fab,
      "Weld.Material_Grade_OverWrite": inputs.weld_material_grade,
      "Design.Design_Method": inputs.design_method,
      "Detailing.Corrosive_Influences": inputs.detailing_corr_status,
      "Detailing.Edge_type": inputs.detailing_edge_type,
      "Connection.Length": inputs.connection_length,
      Module: "Welded to End Gusset",
    };

    createDesign(param, "Welded-to-End-Gusset");
    setDisplayOutput(true);

    setLoading(true);
    setModelKey((prev) => prev + 1);
  };

  // Create design report
  const [CreateDesignReportBool, setCreateDesignReportBool] = useState(false);
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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleCreateDesignReport = () => {
    setCreateDesignReportBool(true);
  };

  useEffect(() => {
    if (renderCadModel && cadModelPaths) {
      console.log("Received raw .obj data:", cadModelPaths);
      setRenderBoolean(true);
      setLoading(false);
    } else {
      setRenderBoolean(false);
    }
  }, [renderCadModel, cadModelPaths]);

  const handleCancel = () => {
    setCreateDesignReportBool(false);
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

  const handleOk = () => {
    if (!output) {
      alert("Please submit the design first.");
      return;
    }
    console.log("designreportInputs : ", designReportInputs);
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

  const saveOutput = () => {
    let data = {};

    if (!inputs.tension_member_section || !output) {
      alert("Please submit the design first.");
      return;
    }

    data = {
      "Connection.Type": conn_map[selectedOption],
      "Member.Section.Designation": inputs.tension_member_section,
      "Member.Material": inputs.member_material,
      "Gusset.Material": inputs.gusset_material,
      "Gusset.Plate.Thickness_List": allSelected.gusset_plate_thickness
        ? plateThicknessList
        : inputs.gusset_plate_thickness,
      "Load.Tension": inputs.load_tension || "",
      "Weld.Type": inputs.weld_type,
      "Weld.Size": inputs.weld_size,
      "Weld.Fab": inputs.weld_fab,
      "Weld.Material_Grade_OverWrite": inputs.weld_material_grade,
      "Design.Design_Method": inputs.design_method,
      "Detailing.Corrosive_Influences": inputs.detailing_corr_status,
      "Detailing.Edge_type": inputs.detailing_edge_type,
      "Connection.Length": inputs.connection_length,
      Module: "Welded to End Gusset",
    };

    Object.keys(output).map((key, index) => {
      Object.values(output[key]).map((elm, index1) => {
        data[key + "." + elm.label.split(" ").join("_")] = elm.val;
      });
    });

    data = convertToCSV(data);
    const csvContent =
      "data:text/csv;charset=utf-8," + encodeURIComponent(data);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "output.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setInputs({
      tension_member_section: "L 50 x 50 x 5",
      gusset_plate_thickness: [],
      member_material: "E 250 (Fe 410 W)A",  
      gusset_material: "E 250 (Fe 410 W)A",
      load_tension: "",
      module: "Welded to End Gusset",
      weld_type: "Fillet Weld",
      weld_size: "6",
      weld_fab: "Shop Weld",
      weld_material_grade: "410",
      detailing_edge_type: "Rolled, machine-flame cut, sawn and planed",
      detailing_corr_status: "No",
      design_method: "Limit State Design",
      connection_length: "150",
    });

    setAllSelected({
      gusset_plate_thickness: true,
    });

    setPlateThicknessSelect("All");
    handleAllSelectPT("All");

    setRenderBoolean(false);
    setOutput(null);
  };

  const [selectedPlateThicknessItems, setSelectedPlateThicknessItems] =
    useState([]);

  const handleTransferChangeInPlateThickness = (nextTargetKeys) => {
    setSelectedPlateThicknessItems(nextTargetKeys);
    setInputs({ ...inputs, gusset_plate_thickness: nextTargetKeys });
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

  const [isDesignPreferencesModelOpen, setDesignPreferencesModel] =
    useState(false);

  const closeDesignPreferencesModel = () => {
    setDesignPreferencesModel(false);
  };

  useEffect(() => {
    if (inputs.tension_member_section != "") {
      getDesingPrefData({
        tension_member_section: inputs.tension_member_section,
        connectivity: conn_map[selectedOption],
      });
    }
  }, [inputs.tension_member_section, selectedOption]);

  const navigate = useNavigate();
  return (
    <>
      <div className="module_base">
        <div className="module_nav">
          {MenuItems.map((item, index) => (
            <DropdownMenu
              key={index}
              label={item.label}
              dropdown={item.dropdown}
              setDesignPrefModalStatus={setDesignPrefModalStatus}
              inputs={inputs}
              setInputs={setInputs}
              allSelected={allSelected}
              setAllSelected={setAllSelected}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              logs={logs}
              setCreateDesignReportBool={setCreateDesignReportBool}
              setDisplaySaveInputPopup={setDisplaySaveInputPopup}
              setSaveInputFileName={setSaveInputFileName}
              triggerScreenshotCapture={triggerScreenshotCapture}
            />
          ))}

          {displaySaveInputPopup && (
            <span id="save-input-style" style={{ marginTop: "18px" }}>
              <strong>
                Saved input file as &quot; {saveInputFileName} &quot;
              </strong>
            </span>
          )}

          <div className="element">
            <div
              className="home-btn"
              onClick={() => {
                navigate("/home");
              }}
            >
              Home
            </div>
          </div>
        </div>

        {/* Main Body of code  */}
        <div className="superMainBody">
          {/* Left */}
          <div className="InputDock">
            <p>Input Dock</p>
            <div className="subMainBody scroll-data">
              {/* Section 1 Start */}
              <h3>Connection Details</h3>
              <div className="component-grid">
                <div className="component-grid-align">
                  <h4>Connection Type</h4>
                  <Select onSelect={handleSelectChange} value={selectedOption}>
                    {Object.keys(conn_map).map((item, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="connectionimg">
                  <img
                    src={imageSource}
                    alt="Component"
                    height="100px"
                    width="100px"
                  />
                </div>

                <div className="component-grid-align">
                  <h4>Tension Member Section*</h4>
                  <Select
                    value={inputs.tension_member_section}
                    onSelect={(value) =>
                      setInputs({ ...inputs, tension_member_section: value })
                    }
                  >
                    {selectedOption === "Channel" ? (
                      channelList?.map((item, index) => (
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      ))
                    ) : (
                      angleList?.map((item, index) => (
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      ))
                    )}
                  </Select>
                </div>

                <div className="component-grid-align">
                  <h4>Member Material</h4>
                  <Select
                    value={inputs.member_material}
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
                        member_material: material.Grade,
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

                <div className="component-grid-align">
                  <h4>Gusset Material</h4>
                  <Select
                    value={inputs.gusset_material}
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
                        gusset_material: material.Grade,
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
              </div>
              {/* Section End */}

              {/* Section Start  */}
              <h3>Factored Loads</h3>
              <div className="component-grid">
                <div className="component-grid-align">
                  <h4>Tension Force(kN)</h4>
                  <Input
                    type="text"
                    name="TensionForce"
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      );
                    }}
                    pattern="\d*"
                    value={inputs.load_tension}
                    onChange={(event) =>
                      setInputs({ ...inputs, load_tension: event.target.value })
                    }
                  />
                </div>
              </div>
              {/* Section End */}

              {/* Section Start - Weld */}
              <h3>Weld</h3>
              <div className="component-grid">
                <div className="component-grid-align">
                  <h4>Weld Type</h4>
                  <Select
                    value={inputs.weld_type}
                    onSelect={(value) =>
                      setInputs({ ...inputs, weld_type: value })
                    }
                  >
                    <Option value="Fillet Weld">Fillet Weld</Option>
                    <Option value="Groove Weld">Groove Weld</Option>
                  </Select>
                </div>

                <div className="component-grid-align">
                  <h4>Weld Size(mm)</h4>
                  <Input
                    type="text"
                    name="WeldSize"
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      );
                    }}
                    pattern="\d*"
                    value={inputs.weld_size}
                    onChange={(event) =>
                      setInputs({ ...inputs, weld_size: event.target.value })
                    }
                  />
                </div>

                <div className="component-grid-align">
                  <h4>Fabrication</h4>
                  <Select
                    value={inputs.weld_fab}
                    onSelect={(value) =>
                      setInputs({ ...inputs, weld_fab: value })
                    }
                  >
                    <Option value="Shop Weld">Shop Weld</Option>
                    <Option value="Field Weld">Field Weld</Option>
                  </Select>
                </div>

                <div className="component-grid-align">
                  <h4>Material Grade</h4>
                  <Input
                    type="text"
                    name="WeldMaterialGrade"
                    value={inputs.weld_material_grade}
                    onChange={(event) =>
                      setInputs({ ...inputs, weld_material_grade: event.target.value })
                    }
                  />
                </div>
              </div>
              {/* Section End */}

              {/* Section Start - Gusset Plate */}
              <h3>Gusset Plate</h3>
              <div className="component-grid">
                <div className="component-grid-align">
                  <h4>Thickness(mm)</h4>
                  <Select onSelect={handleAllSelectPT} value={plateThicknessSelect}>
                    <Option value="Customized">Customized</Option>
                    <Option value="All">All</Option>
                  </Select>
                </div>
                <Modal
                  open={plateThicknessModal}
                  onCancel={() => setPlateThicknessModal(false)}
                  footer={null}
                  width={500}
                  height={500}
                >
                  <div className="popUp">
                    <h3>Customized</h3>
                    <Transfer
                      dataSource={plateThicknessList
                        ?.sort((a, b) => Number(a) - Number(b))
                        .map((label) => ({
                          key: label,
                          label: <h5>{label}</h5>,
                        }))}
                      targetKeys={selectedPlateThicknessItems}
                      onChange={handleTransferChangeInPlateThickness}
                      render={(item) => item.label}
                      titles={["Available", "Selected"]}
                      showSearch
                      listStyle={{ height: 400, width: 300 }}
                    />
                  </div>
                </Modal>

                <div className="component-grid-align">
                  <h4>Connection Length(mm)</h4>
                  <Input
                    type="text"
                    name="ConnectionLength"
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9.]/g,
                        ""
                      );
                    }}
                    pattern="\d*"
                    value={inputs.connection_length}
                    onChange={(event) =>
                      setInputs({ ...inputs, connection_length: event.target.value })
                    }
                  />
                </div>
              </div>
              {/* Section End */}
            </div>
            <div className="inputdock-btn">
              <Input
                type="button"
                value="Reset"
                onClick={() => handleReset()}
              />
              <Input
                type="button"
                value="Design"
                onClick={() => handleSubmit()}
              />
            </div>
          </div>

          {/* Middle */}
          <div className="superMainBody_mid">
            <div className="options-container">
              {options.map((option) => (
                <div
                  key={option}
                  className="option-wrapper"
                  onClick={() => setSelectedView(option)}
                >
                  <div
                    className={`option-box ${
                      selectedView === option ? "selected" : ""
                    }`}
                  ></div>
                  <span className="option-label">{option}</span>
                </div>
              ))}
            </div>
            {loading ? (
              <div className="modelLoading">
                <p>Loading Model...</p>
              </div>
            ) : renderBoolean ? (
              <div className="cadModel">
                <Canvas
                  gl={{ antialias: true }}
                  style={{ background: "#ADD8E6" }}
                  camera={{
                    position: [10, 0, 10],
                    fov: 50,
                    near: 0.1,
                    far: 1000,
                  }}
                >
                  <Suspense
                    fallback={
                      <Html>
                        <p>Loading 3D Model...</p>
                      </Html>
                    }
                  >
                    <Model
                      modelPaths={cadModelPaths}
                      selectedView={selectedView}
                      key={modelKey}
                    />
                    <ScreenshotCapture
                      screenshotTrigger={screenshotTrigger}
                      setScreenshotTrigger={setScreenshotTrigger}
                      selectedView={selectedView}
                    />
                  </Suspense>
                </Canvas>
              </div>
            ) : (
              <div className="modelback"></div>
            )}
            <Logs logs={logs} />
          </div>

          {/* Right */}
          <div className="superMain_right">
            {<WeldedToEndGussetOutputDock output={output} />}
            <div className="outputdock-btn">
              <Input
                type="button"
                value="Create Design Report"
                onClick={handleCreateDesignReport}
              />
              <Input type="button" value="Save Output" onClick={saveOutput} />

              <Modal
                open={CreateDesignReportBool}
                onCancel={handleCancel}
                footer={null}
                className="designModal"
              >
                <p>Design Report Summary</p>
                <div className="design-report-form">
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Company Name:</label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Company Logo : </label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Group/Team Name:</label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Designer:</label>
                    </Col>
                    <Col span={18}>
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
                  {/* <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                    <Upload beforeUpload={handleFileChange} showUploadList={false}>
                      <Button onClick={handleUseProfile} icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    <Button type="button" onClick={handleSaveProfile}>Save Profile</Button>
                  </div> */}
                  <Row
                    gutter={[16, 16]}
                    align="middle"
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Project Title:</label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Subtitle:</label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Job Number:</label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Client:</label>
                    </Col>
                    <Col span={18}>
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
                    style={{ marginBottom: "5px" }}
                  >
                    <Col span={6}>
                      <label>Additional Comments:</label>
                    </Col>
                    <Col span={18}>
                      <Input.TextArea
                        value={designReportInputs.additionalComments}
                        onChange={(e) =>
                          setDesignReportInputs({
                            ...designReportInputs,
                            additionalComments: e.target.value,
                          })
                        }
                        rows={10}
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
                    <Button type="button" onClick={handleOk} className="btn">
                      OK
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelProfile}
                      className="btn"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal>

              {/* Nav Bar Model list */}
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

              {/* Nav Bar Model List End */}
            </div>
          </div>
        </div>
      </div>

      <CustomSectionModal
        showModal={showModal}
        setShowModal={setShowModal}
        setInputValues={setInputs}
        inputValues={inputs}
        type="connector"
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
      ) : (
        <br />
      )}
    </>
  );
}

export default WeldedToEndGusset;
