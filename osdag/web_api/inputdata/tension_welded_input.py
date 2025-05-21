from .input_data_base import InputDataBase
from rest_framework import status
from rest_framework.response import Response
from osdag.models import Columns, Beams, Material, CustomMaterials
import traceback

class TensionWeldedInputData(InputDataBase):
    def process(self, **kwargs):
        connectivity, sectionType, weldSize = kwargs["connectivity"], kwargs["sectionType"], kwargs["weldSize"]
        thickness, email = kwargs["thickness"], kwargs["email"]
        
        if (connectivity is None and sectionType is None and weldSize is None and thickness is None):
            # fetch the list of all the connectivity options for Tension-Welded-Connection
            print("\n\n")
            print('inside connectivtityList handling ')
            print("\n\n")
            connectivityList = ['Beam-Beam', 'Column-Beam', 'Column-Column']
            response = {
                'connectivityList': connectivityList
            }
            return Response(response, status=status.HTTP_200_OK)
            
        if (connectivity == 'Column-Beam' or connectivity == 'Column-Column'):
            # print('connectivity : ', connectivity)

            try:
                # fetch all records from Column table
                # fetch all records from Beam table
                # fetch all records from Material table

                columnList = list(Columns.objects.values_list(
                    'Designation', flat=True))
                beamList = list(Beams.objects.values_list(
                    'Designation', flat=True))
                
                materialList = list(Material.objects.filter().values())
                if email: 
                    custom_material = list(CustomMaterials.objects.filter(email=email).values())
                    materialList = materialList + custom_material

                materialList.append({"id": -1, "Grade": 'Custom'})
                response = {
                    'columnList': columnList,
                    'beamList': beamList,
                    'materialList': materialList 
                }

                return Response(response, status=status.HTTP_200_OK)

            except Exception as err:
                print(err)
                traceback.print_exc()
                return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

        elif (connectivity == 'Beam-Beam'):
            # print('connectivity : ', connectivity)

            # fetch all records from Beams table
            # fetch all records from the Material Table
            try:
                beamList = list(Beams.objects.values_list(
                    'Designation', flat=True))
                materialList = list(Material.objects.all().values())
                if email:
                    custom_material = list(CustomMaterials.objects.filter(email=email).values())
                    materialList = materialList + custom_material
                    
                materialList.append({"id": -1, "Grade": 'Custom'})
                response = {
                    'beamList': beamList,
                    'materialList': materialList
                }

                return Response(response, status=status.HTTP_200_OK)

            except Exception as err:
                print(err)
                traceback.print_exc()
                return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
                
        elif (sectionType == 'Customized'):
            try:
                sectionTypes = ['Angle', 'Channel', 'I-Section', 'T-Section', 'Plate', 'Hollow Section']
                response = {
                    'sectionTypeList': sectionTypes
                }
                
                return Response(response, status=status.HTTP_200_OK)
                
            except Exception as err:
                print(err)
                traceback.print_exc()
                return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

        elif (weldSize == 'Customized'):
            try:
                # standard weld sizes in mm
                weldSizeList = ['3', '4', '5', '6', '8', '10', '12', '14', '16', '18', '20']
                
                response = {
                    'weldSizeList': weldSizeList
                }
                
                return Response(response, status=status.HTTP_200_OK)
                
            except Exception as err:
                print(err)
                traceback.print_exc()
                return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

        elif (thickness == 'Customized'):
            # print('thickness : ', thickness)

            try:
                # standard as per SAIL's product brochure
                PLATE_THICKNESS_SAIL = ['8', '10', '12', '14', '16', '18', '20', '22', '25', '28', '32', '36', '40', '45', '50', '56', '63', '75', '80', '90', '100',
                                        '110', '120']

                response = {
                    'thicknessList': PLATE_THICKNESS_SAIL
                }

                return Response(response, status=status.HTTP_200_OK)

            except Exception as err:
                print(err)
                traceback.print_exc()
                return Response({'error': 'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)
                
        return super().process(kwargs) 
    
