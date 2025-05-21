from osdag_api.validation_utils import validate_arr, validate_num, validate_string
from osdag_api.errors import MissingKeyError, InvalidInputTypeError
from osdag_api.utils import contains_keys, custom_list_validation, float_able, int_able, is_yes_or_no, validate_list_type
import osdag_api.modules.shear_connection_common as scc
from OCC.Core import BRepTools
from cad.common_logic import CommonDesignLogic
# Import the relevant connection class
from design_type.connection.tension_welded_connection import TensionWeldedConnection
import sys
import os
import traceback
from typing import Dict, Any, List

old_stdout = sys.stdout  # Backup log
sys.stdout = open(os.devnull, "w")  # redirect stdout
sys.stdout = old_stdout  # Reset log


def get_required_keys() -> List[str]:
    return [
        "Connectivity",
        "Material",
        "Member.Supported_Section.Designation",
        "Member.Supported_Section.Material",
        "Member.Supporting_Section.Designation",
        "Member.Supporting_Section.Material",
        "Module",
        "Design.Design_Method",
        "Weld.Fab",
        "Weld.Material_Grade_OverWrite",
        "Weld.Size.Flange",
        "Weld.Size.Web",
        "Weld.Type",
        "Load.Axial",
        "Detailing.Corrosive_Influences",
        "Detailing.Gap",
    ]


def validate_input(input_values: Dict[str, Any]) -> None:
    """Validate type for all values in design dict. Raise error when invalid"""

    # Check if all required keys exist
    required_keys = get_required_keys()
    # Check if input_values contains all required keys.
    missing_keys = contains_keys(input_values, required_keys)
    if missing_keys != None:  # If keys are missing.
        # Raise error for the first missing key.
        raise MissingKeyError(missing_keys[0])

    # Validate key types one by one:

    # Validate Connectivity
    # Check if Connectivity is a string.
    if not isinstance(input_values["Connectivity"], str):
        # If not, raise error.
        raise InvalidInputTypeError("Connectivity", "str")

    # Validate Material
    # Check if Material is a string.
    if not isinstance(input_values["Material"], str):
        raise InvalidInputTypeError("Material", "str")  # If not, raise error.

    # Validate Member.Supported_Section.Designation
    # Check if Member.Supported_Section.Designation is a string.
    if not isinstance(input_values["Member.Supported_Section.Designation"], str):
        # If not, raise error.
        raise InvalidInputTypeError(
            "Member.Supported_Section.Designation", "str")

    # Validate Member.Supported_Section.Material
    # Check if Member.Supported_Section.Material is a string.
    if not isinstance(input_values["Member.Supported_Section.Material"], str):
        # If not, raise error.
        raise InvalidInputTypeError("Member.Supported_Section.Material", "str")

    # Validate Member.Supporting_Section.Designation
    # Check if Member.Supporting_Section.Designation is a string.
    if not isinstance(input_values["Member.Supporting_Section.Designation"], str):
        # If not, raise error.
        raise InvalidInputTypeError(
            "Member.Supporting_Section.Designation", "str")

    # Validate Member.Supporting_Section.Material
    # Check if Member.Supporting_Section.Material is a string.
    if not isinstance(input_values["Member.Supporting_Section.Material"], str):
        # If not, raise error.
        raise InvalidInputTypeError(
            "Member.Supporting_Section.Material", "str")

    # Validate Module
    # Check if Module is a string.
    if not isinstance(input_values["Module"], str):
        raise InvalidInputTypeError("Module", "str")  # If not, raise error.

    # Validate Design.Design_Method
    # Check if Design.Design_Method is a string.
    if not isinstance(input_values["Design.Design_Method"], str):
        # If not, raise error.
        raise InvalidInputTypeError("Design.Design_Method", "str")

    # Validate Weld.Fab
    # Check if Weld.Fab is a string.
    if not isinstance(input_values["Weld.Fab"], str):
        raise InvalidInputTypeError("Weld.Fab", "str")  # If not, raise error.

    # Validate Weld.Material_Grade_OverWrite
    weld_materialgradeoverwrite = input_values["Weld.Material_Grade_OverWrite"]
    if (not isinstance(weld_materialgradeoverwrite, str)  # Check if Weld.Material_Grade_OverWrite is a string.
            or not int_able(weld_materialgradeoverwrite)):  # Check if Weld.Material_Grade_OverWrite can be converted to int.
        # If any of these conditions fail, raise error.
        raise InvalidInputTypeError(
            "Weld.Material_Grade_OverWrite", "str where str can be converted to int.")

    # Validate Weld.Size.Flange
    weld_size_flange = input_values["Weld.Size.Flange"]
    if (not isinstance(weld_size_flange, str)  # Check if Weld.Size.Flange is a string.
            or not int_able(weld_size_flange)):  # Check if Weld.Size.Flange can be converted to int.
        # If any of these conditions fail, raise error.
        raise InvalidInputTypeError(
            "Weld.Size.Flange", "str where str can be converted to int")

    # Validate Weld.Size.Web
    weld_size_web = input_values["Weld.Size.Web"]
    if (not isinstance(weld_size_web, str)  # Check if Weld.Size.Web is a string.
            or not int_able(weld_size_web)):  # Check if Weld.Size.Web can be converted to int.
        # If any of these conditions fail, raise error.
        raise InvalidInputTypeError(
            "Weld.Size.Web", "str where str can be converted to int")

    # Validate Weld.Type
    # Check if Weld.Type is a string.
    if not isinstance(input_values["Weld.Type"], str):
        # If not, raise error.
        raise InvalidInputTypeError("Weld.Type", "str")

    # Validate Load.Axial
    load_axial = input_values["Load.Axial"]
    if (not isinstance(load_axial, str)  # Check if Load.Axial is a string.
            or not int_able(load_axial)):  # Check if Load.Axial can be converted to int.
        # If any of these conditions fail, raise error.
        raise InvalidInputTypeError(
            "Load.Axial", "str where str can be converted to int")

    # Validate Detailing.Corrosive_Influences
    # Check if Detailing.Corrosive_Influences is 'Yes' or 'No'.
    if not is_yes_or_no(input_values["Detailing.Corrosive_Influences"]):
        # If not, raise error.
        raise InvalidInputTypeError(
            "Detailing.Corrosive_Influences", "'Yes' or 'No'")

    # Validate Detailing.Gap
    detailing_gap = input_values["Detailing.Gap"]
    if (not isinstance(detailing_gap, str)  # Check if Detailing.Gap is a string.
            or not int_able(detailing_gap)):  # Check if Detailing.Gap can be converted to int.
        # If any of these conditions fail, raise error.
        raise InvalidInputTypeError(
            "Detailing.Gap", "str where str can be converted to int")


def validate_input_new(input_values: Dict[str, Any]) -> None:
    """Validate type for all values in design dict. Raise error when invalid"""

    # Check if all required keys exist
    required_keys = get_required_keys()
    print('required_keys : ', required_keys)
    # Check if input_values contains all required keys.
    missing_keys = contains_keys(input_values, required_keys)
    print('missing keys : ', missing_keys)
    if missing_keys != None:  # If keys are missing.
        # Raise error for the first missing key.
        print("missing keys is not None")
        raise MissingKeyError(missing_keys[0])

    # Validate key types using loops.

    # Validate all strings.
    str_keys = ["Connectivity",  # List of all parameters that are strings
                "Design.Design_Method",
                "Material",
                "Member.Supported_Section.Designation",
                "Member.Supported_Section.Material",
                "Member.Supporting_Section.Designation",
                "Member.Supporting_Section.Material",
                "Module",
                "Weld.Fab",
                "Weld.Type"]
    for key in str_keys:  # Loop through all keys.
        print('validating string key')
        
        try: 
            validate_string(key)  # Check if key is a string. If not, raise error.
        except: 
            print('error in validating string keys')
            print('string key passed  : ', key)

    # Validate for keys that are numbers
    num_keys = [("Weld.Material_Grade_OverWrite", False),  # List of all parameters that are numbers (key, is_float)
                ("Weld.Size.Flange", False),
                ("Weld.Size.Web", False),
                ("Load.Axial", False),
                ("Detailing.Gap", False)]
    for key in num_keys:  # Loop through all keys.
        # Check if key is a number. If not, raise error.
        print('validating num keys')
        validate_num(key[0], key[1])


def create_module() -> TensionWeldedConnection:
    """Create an instance of the tension welded connection module design class and set it up for use"""
    module = TensionWeldedConnection()  # Create an instance of the TensionWeldedConnection
    module.set_osdaglogger(None)
    return module


def create_from_input(input_values: Dict[str, Any]) -> TensionWeldedConnection:
    """Create an instance of the tension welded connection module design class from input values."""
    # validate_input(input_values)
    try: 
        module = create_module()  # Create module instance.
    except Exception as e: 
        print('e in create_module : ', e) 
        print('error in creating module')
    
    # Set the input values on the module instance.
    try: 
        module.set_input_values(input_values)
    except Exception as e: 
        traceback.print_exc()
        print('e in set_input_values : ', e)
        print('error in setting the input values')

    return module


def generate_output(input_values: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate, format and return the input values from the given output values.
    Output format (json): {
        "Weld.Strength": 
            "key": "Weld.Strength",
            "label": "Weld Strength (N/mm²)"
            "value": "460.0"
        }
    }
    """
    output = {}  # Dictionary for formatted values
    module = create_from_input(input_values)  # Create module from input.
    print('module : ', module)
    print('type of module : ', type(module))

    # Generate output values in unformatted form.
    raw_output_text = module.output_values(True)
    raw_output_spacing = module.spacing(True)  # Generate output values
    raw_output_capacities = module.capacities(True)
    raw_output_weld_capacity = module.weld_capacity_details(True)
    logs = module.logs
    
    raw_output = raw_output_capacities + raw_output_spacing + raw_output_text + raw_output_weld_capacity
    
    # Loop over all the text values and add them to output dict.
    for param in raw_output:
        if param[2] == "TextBox":  # If the parameter is a text output,
            key = param[0]  # id/key
            label = param[1]  # label text.
            value = param[3]  # Value as string.
            output[key] = {
                "key": key,
                "label": label,
                "value": value
            }  # Set label, key and value in output
    return output, logs


def create_cad_model(input_values: Dict[str, Any], section: str, session: str) -> str:
    """Generate the CAD model from input values as a BREP file. Return file path."""
    # Error checking: If section is valid.
    if section not in ("Model", "Beam", "Column", "Plate", "Weld"):
        raise InvalidInputTypeError(
            "section", "'Model', 'Beam', 'Column', 'Plate', or 'Weld'")
            
    module = create_from_input(input_values)  # Create module from input.
    print('module from input values : ', module)
    
    # Object that will create the CAD model.
    try: 
        cld = CommonDesignLogic(None, '', module.module, module.mainmodule)
    except Exception as e: 
        print('error in cld e : ', e)
    
    try: 
        # Setup the calculations object for generating CAD model.
        scc.setup_for_cad(cld, module)
    except Exception as e: 
        traceback.print_exc()
        print('Error in setting up cad e : ', e)

    # The section of the module that will be generated.
    cld.component = section
    
    try: 
        model = cld.create2Dcad()  # Generate CAD Model.
    except Exception as e:
        traceback.print_exc()
        print('Error in cld.create2Dcad() e : ', e)
        return False

    # check if the cad_models folder exists or not 
    # if no, then create one 
    if(not os.path.exists(os.path.join(os.getcwd(), "file_storage/cad_models/"))):
        print('path does not exists cad_models, creating one')
        os.mkdir(os.path.join(os.getcwd(), "file_storage/cad_models/"))
      
    print('2d model : ', model)
    file_name = session + "_" + section + ".brep"
    file_path = "file_storage/cad_models/" + file_name
    print('brep file path in create_cad_model : ', file_path)

    try: 
        BRepTools.breptools.Write(model, file_path) # Generate CAD Model
    except Exception as e: 
        print('Writing to BREP file failed e : ', e)
    
    return file_path