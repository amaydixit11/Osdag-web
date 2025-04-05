import React, { useState } from 'react';
import OutputDock from './OutputDock';
import InputDock from './InputDock';
import { PanelLeft, PanelRight} from 'lucide-react';
import MenuBar from './MenuBar';
import MainContent from './MainContent';

// import '../../../../input.css'

function CoverPlateBolted() {
  const [showInputDock, setShowInputDock] = useState(true);
  const [showOutputDock, setShowOutputDock] = useState(true);
  
  const outputData = {
    title: "Output Results",
    sections: [
      {
        id: "memberCapacity",
        title: "Member Capacity",
        fields: [
          {
            id: "memberCapacity",
            type: "result",
            label: "Member Capacity",
            onClick: () => alert("Member Capacity")
          }
        ]
      },
      {
        id: "bolt",
        title: "Bolt",
        fields: [
          {
            id: "diameter",
            type: "input",
            label: "Diameter",
            value: "",
            unit: "mm"
          },
          {
            id: "propertyClass",
            type: "input",
            label: "Property Class",
            value: "",
            required: true
          }
        ],
        subsections: [
          {
            id: "boltCapacities",
            title: "Bolt Capacities",
            fields: [
              {
                id: "flangeBoltCapacity",
                type: "result",
                label: "Flange Bolt Capacity",
                onClick: () => alert("Flange Bolt Capacity")
              },
              {
                id: "webBoltCapacity",
                type: "result",
                label: "Web Bolt Capacity",
                onClick: () => alert("Web Bolt Capacity")
              }
            ]
          }
        ]
      },
      {
        id: "webSplicePlate",
        title: "Web Splice Plate",
        fields: [
          {
            id: "height",
            type: "input",
            label: "Height",
            value: "",
            unit: "mm"
          },
          {
            id: "width",
            type: "input",
            label: "Width",
            value: "",
            unit: "mm"
          },
          {
            id: "thickness",
            type: "input",
            label: "Thickness",
            value: "",
            unit: "mm",
            required: true
          }
        ],
        subsections: [
          {
            id: "webResults",
            title: "Results",
            fields: [
              {
                id: "spacing",
                type: "result",
                label: "Web Spacing",
                onClick: () => alert("Showing detailed results")
              },
              {
                id: "capacity",
                type: "result",
                label: "Web Capacity",
                onClick: () => alert("Showing detailed results")
              }
            ]
          }
        ]
      },
      {
        id: "flangeSplicePlate",
        title: "Flange Splice Plate",
        subtitle: "Outer Plate",
        fields: [
          {
            id: "width",
            type: "input",
            label: "Width",
            value: "",
            unit: "mm"
          },
          {
            id: "length",
            type: "input",
            label: "Length",
            value: "",
            unit: "mm"
          },
          {
            id: "thickness",
            type: "input",
            label: "Thickness",
            value: "",
            unit: "mm",
            required: true
          }
        ],
        subsections: [
          {
            id: "flangeResults",
            title: "Results",
            fields: [
              {
                id: "spacing",
                type: "result",
                label: "Flange Spacing",
                onClick: () => alert("Spacing")
              },
              {
                id: "capacity",
                type: "result",
                label: "Flange Capacity",
                onClick: () => alert("Capacity")
              }
            ]
          }
        ]
      }
    ]
  };
  
  const outputActions = [
    {
      id: "createReport",
      label: "Create Design Report",
      onClick: () => alert("Creating design report...")
    },
    {
      id: "saveOutput",
      label: "Save Output",
      onClick: () => alert("Saving output...")
    }
  ];

  const inputInitialFormData = {
    sectionDesignation: 'JB 150',
    material: 'E 165 (Fe 290)',
    bendingMoment: '30',
    shearForce: '30',
    axialForce: '10',
    boltDiameter: 'All',
    boltType: 'Bearing Bolt',
    boltPropertyClass: 'All',
    flangePreference: 'Outside',
    flangeThickness: 'All',
    webThickness: 'All'
  };

  const inputSections = [
    {
      id: 'connecting-members',
      title: 'Connecting Members',
      fields: [
        {
          id: 'section',
          label: 'Section Designation',
          name: 'sectionDesignation',
          type: 'select',
          options: ['JB 150', 'ISMB 100', 'ISMB 150'],
          required: true
        },
        {
          id: 'material',
          label: 'Material',
          name: 'material',
          type: 'select',
          options: ['E 165 (Fe 290)'],
          required: true
        }
      ]
    },
    {
      id: 'factored-loads',
      title: 'Factored Loads',
      fields: [
        {
          id: 'bending-moment',
          label: 'Bending Moment (kNm)',
          name: 'bendingMoment',
          type: 'number',
          required: true,
          placeholder: 'Enter value'
        },
        {
          id: 'shear-force',
          label: 'Shear Force (kN)',
          name: 'shearForce',
          type: 'number',
          required: true,
          placeholder: 'Enter value'
        },
        {
          id: 'axial-force',
          label: 'Axial Force (kN)',
          name: 'axialForce',
          type: 'number',
          required: false,
          placeholder: 'Enter value (optional)'
        }
      ]
    },
    {
      id: 'bolt',
      title: 'Bolt',
      fields: [
        {
          id: 'bolt-diameter',
          label: 'Diameter (mm)',
          name: 'boltDiameter',
          type: 'select',
          options: ['All', '16', '20', '24'],
          required: true
        },
        {
          id: 'bolt-type',
          label: 'Type',
          name: 'boltType',
          type: 'select',
          options: ['Bearing Bolt', 'Friction Bolt'],
          required: true
        },
        {
          id: 'bolt-property-class',
          label: 'Property Class',
          name: 'boltPropertyClass',
          type: 'select',
          options: ['All', '4.6', '8.8', '10.9'],
          required: true
        }
      ]
    },
    {
      id: 'flange-splice-plate',
      title: 'Flange Splice Plate',
      fields: [
        {
          id: 'flange-preference',
          label: 'Preference',
          name: 'flangePreference',
          type: 'select',
          options: ['Outside', 'Inside', 'Both'],
          required: true
        },
        {
          id: 'flange-thickness',
          label: 'Thickness (mm)',
          name: 'flangeThickness',
          type: 'select',
          options: ['All', '8', '10', '12', '16'],
          required: true
        }
      ]
    },
    {
      id: 'web-splice-plate',
      title: 'Web Splice Plate',
      fields: [
        {
          id: 'web-thickness',
          label: 'Thickness (mm)',
          name: 'webThickness',
          type: 'select',
          options: ['All', '6', '8', '10', '12'],
          required: true
        }
      ]
    }
  ];

  const inputFormActions = [
    {
      id: 'design',
      label: 'Design',
      onClick: (formData) => {
        console.log('Design with:', formData);
        // Implement your design logic here
      },
      disabled: false // You could add validation logic here
    }
  ];

  const toggleItems = [
    { key: 'showModel', label: 'Model' },
    { key: 'showBeam', label: 'Beam' },
    { key: 'showCoverPlate', label: 'Cover Plate' },
  ]

  const [selectedToggle, setSelectedToggle] = useState('showModel')

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <MenuBar />

      <div className="flex flex-1 gap-0.5 p-0.5">
        <InputDock
          show={showInputDock}
          onClose={() => setShowInputDock(false)}
          sections={inputSections}
          actions={inputFormActions}
          initialFormData={inputInitialFormData}
        />
        
        <MainContent
          showInputDock={showInputDock}
          setShowInputDock={setShowInputDock}
          showOutputDock={showOutputDock}
          setShowOutputDock={setShowOutputDock}
          toggleItems={toggleItems}
          selectedToggle={selectedToggle}
          setSelectedToggle={setSelectedToggle}
        />
                
        <OutputDock 
          show={showOutputDock} 
          onClose={()=>{setShowOutputDock(false)}}
          data={outputData}
          actions={outputActions}
        />
      </div>
    </div>
  );
}

export default CoverPlateBolted;