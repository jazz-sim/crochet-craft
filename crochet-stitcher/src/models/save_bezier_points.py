# Saves the selected Bezier curve into a file.
# Assumes one spline only.

import json
import os

import bpy


def alert(message, title='Save Bezier Points', icon='INFO'):
    def draw(self, context):
        for line in message.strip('\r\n').splitlines():
            self.layout.label(text=line)

    bpy.context.window_manager.popup_menu(draw, title=title, icon=icon)


obj = bpy.context.active_object
curve = obj.data
spline = curve.splines[0]
scale = obj.scale

points = []
for point in spline.bezier_points:
    points.append(point.handle_left * scale)
    points.append(point.co * scale)
    points.append(point.handle_right * scale)
points = points[1:-1]  # Remove unnecessary first and last control points

# Write results to JSON file
json_path = os.path.splitext(bpy.data.filepath)[0] + '.json'
with open(json_path, 'w') as fd:
    json.dump({
        'curveType': 'bezier',
        'points': [
            [round(coord, 4) for coord in [pt.x, pt.y, pt.z]]
            for pt in points
        ],
    }, fd)

alert(f"""
Done! The {len(points)} points have been saved at:\n
{json_path}\n
Please reformat the file before committing.
""")
