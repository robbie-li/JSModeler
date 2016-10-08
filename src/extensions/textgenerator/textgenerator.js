/**
* Function: GenerateText
* Description:
*	Generates 3D model from the given text. It should get a font
*	specification object created with facetype.js.
* Parameters:
*	text {string} the text
*	fontSpec {object} the font specification object
* Returns:
*	{Model} the result
*/
JSM.GenerateText = function (text, fontSpec)
{
	function CreatePathFromSpecification (commands, segmentation, offset, scale)
	{
		function Num (str)
		{
			return parseFloat (str);
		}
	
		var path = new JSM.Path2D ({
			segmentation : segmentation,
			offset : offset,
			scale : scale
		});
		
		var parts = commands.split (' ');
		var index = 0;
		var current;
		while (index < parts.length) {
			current = parts[index++];
			if (current.length === 0) {
				continue;
			}
			if (current == 'm') {
				path.MoveTo (Num (parts[index++]), Num (parts[index++]));
			} else if (current == 'l') {
				path.LineTo (Num (parts[index++]), Num (parts[index++]));
			} else if (current == 'b') {
				path.CubicBezierTo (Num (parts[index++]), Num (parts[index++]), Num (parts[index++]), Num (parts[index++]), Num (parts[index++]), Num (parts[index++]));
			} else if (current == 'z') {
				path.Close ();
			} else {
				JSM.Message ('Invalid path command found: ' + current);
			}
		}
		return path;
	}

	var model = new JSM.Model ();
	var offset = new JSM.Vector2D (0.0, 0.0);
	var scale = new JSM.Coord2D (0.01, 0.01);
	var segmentation = 10;
	var height = 1;
	var i, j, character, glyphs, path, bodies;
	for (i = 0; i < text.length; i++) {
		character = text[i];
		glyphs = fontSpec.glyphs[character];
		if (glyphs === undefined) {
			continue;
		}
		path = CreatePathFromSpecification (glyphs.o, segmentation, offset, scale);
		bodies = JSM.GeneratePrismsFromPath2D (path, height, true, 160 * JSM.DegRad);
		for (j = 0; j < bodies.length; j++) {
			model.AddBody (bodies[j]);
		}
		offset.x += glyphs.ha * scale.x;
	}
	return model;
};