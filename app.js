(function(window,undefined)
{
	'use strict';
	var total;
	var people=[];
	$(function(){
		$.get('people.json',function(resp)
		{
			var json=(typeof resp !=='object')?JSON.parse(resp):resp;
			total=json.length;
			fetchDateTime(json);
		});
	});
	var fetchDateTime=function(obj)
	{
		var html=[];
		var h=[];
		obj.forEach(function(a,b)
		{
			
			fetchTimeZone(a.city,function(city,timeObj)
			{

				// a.tz=moment().tz(timeObj.timeZoneId).format('MM-DD-YYYY hh:mm dddd');
				a.tz=moment().tz(timeObj.timeZoneId).format('MM-DD-YYYY hh:mm A');
				a.timezone=timeObj.timeZoneId;
				a.zone=moment().tz(timeObj.timeZoneId).format('z');
				$.get('https://api.github.com/users/'+a.ghuser+'?access_token=e67ea19adddc71d25778fc28344e10e53c04b22f',function(resp)
				{
					a.name=resp.name||a.name;
					total--;
					a.image=resp.avatar_url;
					a.url=resp.html_url;
					a.timeObj=timeObj;
					people.push(a);
					if(total<=1)
						$("#container").html(print());
				}).fail(function()
				{
					total--;
				});
			});
		});
	};
	var fetchTimeZone=function(city,callback)
	{
		if(localStorage[city]){
			var t=JSON.parse(localStorage[city]);
			callback(city,t);
			return;
		}
		var url="http://maps.googleapis.com/maps/api/geocode/json?address=";
		$.get(url+city,function(resp)
		{
			if(!resp.results)
				return;
			var lat=resp.results[0].geometry.location.lat;
			var lng=resp.results[0].geometry.location.lng;
			var latLng=lat+','+lng;
			var url='https://maps.googleapis.com/maps/api/timezone/json?location='+latLng+'&timestamp=1331766000&key=AIzaSyCh78qhRtWIEtKdUkWm1uOHZUzSVgbClaI';
			$.get(url,function(resp)
			{
				// console.log(resp);
				localStorage[city]=JSON.stringify(resp);
				if(resp.timeZoneId)
				{
					callback(city,resp);
				}
			});
		});
	};
var sort=function()
{
 var sorted=[];
 // console.log('sorting started');
 people=people.sort(function(a,b)
 {
 	/*console.log(a.timeObj.rawOffset+' a');
 	console.log(b.timeObj.rawOffset+' b');*/
 	if(a.timeObj.rawOffset<b.timeObj.rawOffset)
 		return -1;
 	else if(a.timeObj.rawOffset>b.timeObj.rawOffset)
 		return 1;
 	return 0;
 });
};
var print=function()
	{
		
		var html=[];
		sort();
		people.forEach(function(a,b)
		{
			// console.log(a);
			var h=([
				'<div class="user">',
					'<div>',
						'<a href="',
							a.url,
						'">',
						'<img src="',
							a.image,
							'"></a>',
					'</div>',
					'<div>',
						'<span class="name" >',
						a.name,
						"</span>",
					'</div>',
					'<div>',
						a.zone,
					'</div>',
					'<div class="timezone" data-locale='+a.timezone+'>',
						a.tz,
					'</div>',
				'</div>'
			].join(''));
			html.push(h);
		});
		return html.join('');
	};

	window.setInterval(function()
	{
		$(".timezone").each(function()
		{
			var th=$(this);
			var zone=th.data('locale');
			var newTime=moment().tz(zone).format('MM-DD-YYYY hh:mm A');
			th.html(newTime);
		});
	},60000);



})(window);
(function(window,undefined)
{

})(window);