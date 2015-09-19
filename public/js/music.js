$(document).ready(function() {
	var currentValue = $('#currentValue');
  var music = $('#beethoven')[0];

	$('#speedSlider').change(function(){
	    currentValue.html(this.value);
			music.playbackRate = this.value/1000;
	});

	// Trigger the event on load, so
	// the value field is populated:
	$('#speedSlider').change();
	// music.
});
