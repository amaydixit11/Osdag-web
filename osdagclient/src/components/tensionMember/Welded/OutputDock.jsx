import React from 'react';
import { useState } from 'react';
import { Input, Modal } from 'antd';
import spacingIMG from '../../../assets/spacing_3.png';
import capacityIMG1 from '../../../assets/L_shear1.png';
import capacityIMG2 from '../../../assets/L.png';

const placeholderOutput = {
  Section: [
    { label: "Designation", val: "" },
    { label: "Tension Yielding Capacity (kN)", val: "" },
    { label: "Tension Rupture Capacity (kN)", val: "" },
    { label: "Tension Capacity (kN)", val: "" },
    { label: "Slenderness ratio", val: "" },
    { label: "Utilization Ratio", val: "" }
  ],
  "End Connection": [
    { label: "Type", val: "" }
  ],
  Weld: [
    { label: "Type", val: "" },
    { label: "Size (mm)", val: "" },
    { label: "Strength (N/mm2)", val: "" },
    { label: "Long Joint Red.Factor", val: "" },
    { label: "Red.Strength (N/mm)", val: "" },
    { label: "Stress (N/mm)", val: "" },
    { label: "Eff.Length (mm)", val: "" }
  ],
  "Gusset Plate": [
    { label: "Thickness (mm)", val: "" },
    { label: "Min.Height (mm)", val: "" },
    { label: "Min.Plate Length (mm)", val: "" },
    { label: "Tension Yielding Capacity (kN)", val: "" },
    { label: "Block Shear Capacity (kN)", val: "" },
    { label: "Pattern", val: "" },
    { label: "Tension Capacity (kN)", val: "" }
  ],
  Bolt: [
    { label: "Diameter (mm)", val: "" },
    { label: "Property Class", val: "" },
    { label: "Shear Capacity (kN)", val: "" },
    { label: "Bolt Force (kN)", val: "" },
    { label: "Bolt Column (nos)", val: "" },
    { label: "Bolt Rows (nos)", val: "" },
    { label: "Pitch Distance (mm)", val: "" },
    { label: "End Distance (mm)", val: "" },
    { label: "Edge Distance (mm)", val: "" },
    { label: "Gauge Distance (mm)", val: "" }
  ],
  Plate: [
    { label: "Thickness (mm)", val: "" },
    { label: "Height (mm)", val: "" },
    { label: "Length (mm)", val: "" },
    { label: "Shear Yielding Capacity (kN)", val: "" },
    { label: "Rupture Capacity (kN)", val: "" },
    { label: "Block Shear Capacity (kN)", val: "" },
    { label: "Tension Yielding Capacity (kN)", val: "" },
    { label: "Tension Rupture Capacity (kN)", val: "" },
    { label: "Axial Block Shear Capacity (kN)", val: "" },
    { label: "Moment Demand (kNm)", val: "" },
    { label: "Moment Capacity (kNm)", val: "" }
  ]
};

const OutputDock = ({ output }) => {
  const [spacingModel, setSpacingModel] = useState(false);
  const [capacityModel, setCapacityModel] = useState(false);
  const [shearPatternModal, setShearPatternModal] = useState(false);

  const handleDialogSpacing = (value) => {
    if (value === 'Spacing') {
      setSpacingModel(true);
    } else if (value === 'Capacity') {
      setCapacityModel(true);
    } else if (value === 'Shear Pattern') {
      setShearPatternModal(true);
    } else {
      setSpacingModel(false);
      setCapacityModel(false);
      setShearPatternModal(false);
    }
  };

  // Helper function to check if section exists in output
  const sectionExists = (sectionName) => {
    return output && output[sectionName] && output[sectionName].length > 0;
  };

  // Determine which sections to show based on output type
  const getSections = () => {
    if (output && Object.keys(output).length) {
      // If we have actual output, return its keys
      return Object.keys(output);
    } else {
      // For placeholder output, detect which sections to show based on images
      // Image 1 shows Section Details, End Connection, Weld Details, Gusset Plate Details
      // Image 2 shows End Connection, Weld Details, Gusset Plate Details
      // Image 3 shows a full application
      return ["Section", "End Connection", "Weld", "Gusset Plate"];
    }
  };

  return (
    <div>
      <h5>Output Dock</h5>
      <div className='subMainBody scroll-data'>
        {/* Using actual output if available, otherwise using placeholder */}
        {(output && Object.keys(output).length) ? (
          // Render actual output sections
          <>
            {getSections().map((sectionKey, index) => (
              <div key={index}>
                {sectionKey === "Section" ? (
                  <h3>Section Details</h3>
                ) : sectionKey === "Gusset Plate" ? (
                  <h3>Gusset Plate Details</h3>
                ) : sectionKey === "End Connection" ? (
                  <h3>End Connection</h3>
                ) : sectionKey === "Weld" ? (
                  <h3>Weld Details</h3>
                ) : (
                  <h3>{sectionKey}</h3>
                )}
                
                <div>
                  {output[sectionKey].map((item, itemIndex) => {
                    // Skip certain fields that go into popups
                    if (sectionKey === "Plate" && 
                        ["Shear Yielding Capacity (kN)", "Rupture Capacity (kN)", 
                         "Block Shear Capacity (kN)", "Tension Yielding Capacity (kN)",
                         "Tension Rupture Capacity (kN)", "Axial Block Shear Capacity (kN)",
                         "Moment Demand (kNm)", "Moment Capacity (kNm)"].includes(item.label)) {
                      return null;
                    }
                    if (sectionKey === "Bolt" && 
                        ["Pitch Distance (mm)", "End Distance (mm)", "Edge Distance (mm)", 
                         "Gauge Distance (mm)"].includes(item.label)) {
                      return null;
                    }
                    
                    // Show Pattern with a button for Gusset Plate
                    if (sectionKey === "Gusset Plate" && item.label === "Pattern") {
                      return (
                        <div key={itemIndex} className='component-grid'>
                          <div>
                            <h4>{item.label}</h4>
                          </div>
                          <div>
                            <Input 
                              className='btn' 
                              type="button" 
                              value="Shear Pattern" 
                              onClick={() => handleDialogSpacing("Shear Pattern")}
                            />
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={itemIndex} className='component-grid'>
                        <div>
                          <h4>{item.label}</h4>
                        </div>
                        <div>
                          <Input
                            type="text"
                            style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                            name={`${sectionKey}_${item.label}`}
                            value={item.val}
                            disabled
                          />
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Add Spacing button for Bolt section */}
                  {sectionKey === "Bolt" && (
                    <div className='component-grid'>
                      <div>
                        <h4>Spacing</h4>
                      </div>
                      <div>
                        <Input 
                          className='btn' 
                          type="button" 
                          value="Spacing" 
                          onClick={() => handleDialogSpacing("Spacing")}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Add Capacity button for Plate section */}
                  {sectionKey === "Plate" && (
                    <div className='component-grid'>
                      <div>
                        <h4>Capacity</h4>
                      </div>
                      <div>
                        <Input 
                          className='btn' 
                          type="button" 
                          value="Capacity" 
                          onClick={() => handleDialogSpacing("Capacity")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          // Render placeholder output sections
          <>
            <div>
              <h3>Section Details</h3>
              <div>
                {placeholderOutput.Section.map((item, index) => (
                  <div key={index} className='component-grid' style={{userSelect: 'none'}}>
                    <div>
                      <h4>{item.label}</h4>
                    </div>
                    <div>
                      <Input
                        type="text"
                        style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                        name={`Section_${item.label}`}
                        value={' '}
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3>End Connection</h3>
              <div>
                {placeholderOutput["End Connection"].map((item, index) => (
                  <div key={index} className='component-grid' style={{userSelect: 'none'}}>
                    <div>
                      <h4>{item.label}</h4>
                    </div>
                    <div>
                      <Input
                        type="text"
                        style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                        name={`End Connection_${item.label}`}
                        value={' '}
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3>Weld Details</h3>
              <div>
                {placeholderOutput.Weld.map((item, index) => (
                  <div key={index} className='component-grid' style={{userSelect: 'none'}}>
                    <div>
                      <h4>{item.label}</h4>
                    </div>
                    <div>
                      <Input
                        type="text"
                        style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                        name={`Weld_${item.label}`}
                        value={' '}
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3>Gusset Plate Details</h3>
              <div>
                {placeholderOutput["Gusset Plate"].map((item, index) => {
                  if (item.label === "Pattern") {
                    return (
                      <div key={index} className='component-grid' style={{userSelect: 'none'}}>
                        <div>
                          <h4>{item.label}</h4>
                        </div>
                        <div>
                          <Input
                            className='btn'
                            type="button"
                            value="Shear Pattern"
                            disabled
                          />
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className='component-grid' style={{userSelect: 'none'}}>
                      <div>
                        <h4>{item.label}</h4>
                      </div>
                      <div>
                        <Input
                          type="text"
                          style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                          name={`Gusset Plate_${item.label}`}
                          value={' '}
                          disabled
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spacing Modal */}
      <Modal
        visible={spacingModel}
        onCancel={() => setSpacingModel(false)}
        footer={null}
        width={'100vh'}
      >
        <>
          <div style={{ textAlign: 'center' }}>
            <h3>Spacing Details</h3>
          </div>

          <div>
            <p style={{ padding: '20px' }}>
              Note: Representative image for Spacing Details -3 x 3 pattern considered 
            </p>
          </div>
          <div className='spacing-main-body'>
            <div className='spacing-left-body'>
              <div>
                <h4>Pitch Distance (mm)</h4>
              </div>
              <div>
                <Input
                  type="text"
                  style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                  readOnly={true}
                  value={(output && output.Bolt && output?.Bolt.find(val => val.label == "Pitch Distance (mm)")?.val) || "0"}
                />
              </div>
              <div>
                <h4>End Distance (mm)</h4>
              </div>
              <div>
                <Input
                  type="text"
                  style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                  readOnly={true}
                  value={(output && output.Bolt && output?.Bolt.find(val => val.label == "End Distance (mm)")?.val) || "0"}
                />
              </div>
              <div>
                <h4>Gauge Distance (mm)</h4>
              </div>
              <div>
                <Input
                  type="text"
                  style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                  readOnly={true}
                  value={(output && output.Bolt && output?.Bolt.find(val => val.label == "Gauge Distance (mm)")?.val) || "0"}
                />
              </div>
              <div>
                <h4>Edge Distance (mm)</h4>
              </div>
              <div>
                <Input
                  type="text"
                  style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                  readOnly={true}
                  value={(output && output.Bolt && output?.Bolt.find(val => val.label == "Edge Distance (mm)")?.val) || "0"}
                />
              </div>
            </div>
            <div className='spacing-right-body'> 
              <img src={spacingIMG} alt='SpacingImage'/>
            </div>
          </div>
        </>
      </Modal>

      {/* Capacity Modal */}
      <Modal
        visible={capacityModel}
        onCancel={() => setCapacityModel(false)}
        footer={null}
        width={'120vh'}
        style={{ maxHeight: '800px', overflow: 'auto' }}
      >
        <>
          <div style={{ textAlign: 'center' }}>
            <h3>Capacity Details</h3>
          </div>

          <div>
            <p style={{ padding: '20px' }}>
              Note: Representative image for Failure Pattern (Half Pate) - 2 x 3 Bolt pattern considered 
            </p>
          </div>
          <div className='Capacity-main-body'>
            {/* Section 1: Failure due Shear in Plate */}
            <div>
              <div className='Capacity-sub-body-title'> 
                <h4>Failure due Shear in Plate</h4>
              </div>
              <div className='Capacity-sub-body'>
                <div className='Capacity-left-body'> 
                  <div>
                    <h4>Shear Yielding Capacity (kN)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Shear Yielding Capacity (kN)")?.val) || "0"}
                    />
                  </div>
                  <div>
                    <h4>Rupture Capacity (kN)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Rupture Capacity (kN)")?.val) || "0"}
                    />
                  </div>
                  <div>
                    <h4>Block Shear Capacity (kN)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Block Shear Capacity (kN)")?.val) || "0"}
                    />
                  </div>
                </div>
                <div className='Capacity-right-body'> 
                  <img src={capacityIMG1} alt='capacityIMG1'/>
                  <h5>Block Shear Pattern</h5>
                </div>
              </div>
            </div>
            
            {/* Section 2: Failure due Tension in Plate */}
            <div>
              <div className='Capacity-sub-body-title'> 
                <h4>Failure due Tension in Plate</h4>
              </div>
              <div className='Capacity-sub-body'>
                <div className='Capacity-left-body'> 
                  <div>
                    <h4>Tension Yielding Capacity (kN)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Tension Yielding Capacity (kN)")?.val) || "0"}
                    />
                  </div>
                  <div>
                    <h4>Tension Rupture Capacity (kN)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Tension Rupture Capacity (kN)")?.val) || "0"}
                    />
                  </div>
                  <div>
                    <h4>Axial Block Shear Capacity (kN)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Axial Block Shear Capacity (kN)")?.val) || "0"}
                    />
                  </div>
                </div>
                <div className='Capacity-right-body'> 
                  <img src={capacityIMG2} alt='capacityIMG2'/>
                  <h5>Block Shear Pattern</h5>
                </div>
              </div>
            </div>
            
            {/* Section 3: Additional Details */}
            <div>
              <div className='Capacity-sub-body-title'> 
                <h4>Additional Details</h4>
              </div>
              <div className='Capacity-sub-body'>
                <div className='Capacity-left-body'> 
                  <div>
                    <h4>Moment Demand (kNm)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500', marginBottom: '20px' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Moment Demand (kNm)")?.val) || "0"}
                    />
                  </div>
                  <div>
                    <h4>Moment Capacity (kNm)</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={(output && output.Plate && output?.Plate.find(val => val.label == "Moment Capacity (kNm)")?.val) || "0"}
                    />
                  </div>
                </div>
                <div className='Capacity-right-body'> 
                  {/* No image for this section */}
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>

      {/* Shear Pattern Modal */}
      <Modal
        visible={shearPatternModal}
        onCancel={() => setShearPatternModal(false)}
        footer={null}
        width={'100vh'}
      >
        <>
          <div style={{ textAlign: 'center' }}>
            <h3>Shear Pattern Details</h3>
          </div>

          <div>
            <p style={{ padding: '20px' }}>
              Note: Representative image for Shear Pattern 
            </p>
          </div>
          <div className='spacing-main-body'>
            <div className='spacing-left-body'>
              <div>
                <h4>Block Shear Capacity (kN)</h4>
              </div>
              <div>
                <Input
                  type="text"
                  style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                  readOnly={true}
                  value={(output && output["Gusset Plate"] && output?.["Gusset Plate"].find(val => val.label == "Block Shear Capacity (kN)")?.val) || "0"}
                />
              </div>
              <div>
                <h4>Tension Capacity (kN)</h4>
              </div>
              <div>
                <Input
                  type="text"
                  style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                  readOnly={true}
                  value={(output && output["Gusset Plate"] && output?.["Gusset Plate"].find(val => val.label == "Tension Capacity (kN)")?.val) || "0"}
                />
              </div>
            </div>
            <div className='spacing-right-body'> 
              <img src={capacityIMG1} alt='ShearPatternImage'/>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default OutputDock;