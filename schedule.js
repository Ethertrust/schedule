var infdata;
var institutelist;
var specialitylist;
var codelist;
var kurslist;
var grouplist;
$(document).ready(function() 
  {
	 
	  
		$('body').on('click',function(){$('.tip').remove();});
	  $.ajax({
						type:'post',
						url:'scheduleinf.php',
						cache:false
					  }).done(function(data)
								{
									infdata=data;
									institutelist = $('<select multiple size="6" class="institutelist" name="select" id="institutelist" data-placeholder="Все...">')
									.append($('<option value="Все...">'));
									var temp="";
									for(var row in infdata)
									{
										if(temp.localeCompare(infdata[row]["institute_name"]))
													institutelist.append($('<option >').html(infdata[row]["institute_name"]));
										temp=infdata[row]["institute_name"]
									}
									institutelist.append($('</select>'));
									specialitylist = $('<select multiple size="6" class="specialitylist" name="specialityselect" id="specialitylist" data-placeholder="Все...">')
									.append($('<option value="Все...">'));
									for(var row in infdata)
									{
									var exists=false;
										for(var i=0; i<row; i++)
										if(infdata[i]["speciality_name"].localeCompare(infdata[row]["speciality_name"])==0)
										{
											exists=true;
											break;
										}
										if(!exists)
											specialitylist.append($('<option >').html(infdata[row]["speciality_name"]));
									}
									specialitylist.append($('</select>'));
									codelist = $('<select multiple size="6" class="codelist" name="codeselect" id="codelist" data-placeholder="Все...">')
									.append($('<option value="Все...">'));
									temp="";
									for(var row in infdata)
									{
										if(temp.localeCompare(infdata[row]["speciality_code"]))
													codelist.append($('<option >').html(infdata[row]["speciality_code"]));
										temp=infdata[row]["speciality_code"]
									}
									codelist.append($('</select>'));
									kurslist = $('<select multiple size="6" class="kurslist" name="kursselect" id="kurslist" data-placeholder="Все...">')
									.append($('<option value="Все...">'));
									var temp2 = new Array(1,2,3,4,5,6,7,8,9);
									for(var k in temp2)
									{
										for(var row in infdata)
										{
										
											if(infdata[row]["kurs"]==k)
											{
												kurslist.append($('<option >').html(infdata[row]["kurs"]));
												break;
											}
										}
									}
									kurslist.append($('</select>'));
									grouplist = $('<select multiple size="6" class="grouplist" name="groupselect" id="grouplist" data-placeholder="Ни одной...">')
									.append($('<option value="Все...">'));
									temp="";
									for(var row in infdata)
									{
										if(temp.localeCompare(infdata[row]["groups_name"]))
													grouplist.append($('<option >').html(infdata[row]["groups_name"]));
										temp=infdata[row]["groups_name"]
									}
									grouplist.append($('</select>'));
										
									specialitycreate();
										
										$('#button1').on('click', function()
										{
											$('.chooseform').toggle();
											$('.scheduleform').toggle();
										});
								});
	schedulecreate();
  });
 
 function schedulecreate()
 {
	 	var div = $('<div class="scheduleform" name="scheduleform" style="display: none">');
		$('body').append(div);	
 };
 
  function specialitycreate()
  {	  
	  	var div = $('<div class="chooseform" name="chooseform">');
		var form = $('<form name="choseform">').append($('<label for "institutelist">Институт: </label>'))
		.append(institutelist)
		.append($('<p>'))
		.append($('<label for specialitylist>Специальность: </label>'))
		.append(specialitylist)
		.append($('<label for codelist>Код: </label>'))
		.append(codelist)
		.append($('</p>'))
		.append($('<label for kurslist> Курс: </label>'))
		.append(kurslist)
		.append($('<p>'))
		.append($('<label for grouplist>Группа: </label>'))
		.append(grouplist)
		.append($('</p>'))
		.append($('<button class="infbutton" type="submit" id="chooseformsubmit">')
		.html('Применить')).append($('</form>'));	
		div.append(form);
		$('body').append(div);
		
		$('.institutelist').on('change', function(event)
		{
							var choseninstituts = $('.institutelist').val();
							if (!choseninstituts)
							{
								choseninstituts = [];
								$('.institutelist option').each(function()
								{
									choseninstituts.push($(this).val());
									console.log(choseninstituts);
								})
							}			
							var chosenspecialities = $('.specialitylist').val();
							document.choseform.specialityselect.options.length=1;
									for(var row in infdata)
									{
										var ifchosen = ischosengroups(chosenspecialities, infdata[row]["speciality_name"]);
										if(ifchosen || (choseninstituts.indexOf(infdata[row]["institute_name"])!=-1))
										{
										var exists=false;
										for(var i=0; i<row; i++)
										if(infdata[i]["speciality_name"].localeCompare(infdata[row]["speciality_name"])==0)
										{
											exists=true;
											break;
										}
										if(!exists)
											document.choseform.specialityselect.options[document.choseform.specialityselect.options.length]= new Option(infdata[row]["speciality_name"],infdata[row]["speciality_name"],false,ifchosen);
										}
									}
									chosengroups=[];
							$('.specialitylist').trigger('chosen:updated');			
							
							var chosencodes = $('.codelist').val();
							document.choseform.codeselect.options.length=1;
									for(var row in infdata)
									{
										var ifchosen = ischosengroups(chosencodes, infdata[row]["speciality_code"]);
										if(ifchosen || (choseninstituts.indexOf(infdata[row]["institute_name"])!=-1))
										{
										var exists=false;
										for(var i=0; i<row; i++)
										if(infdata[i]["speciality_code"].localeCompare(infdata[row]["speciality_code"])==0)
										{
											exists=true;
											break;
										}
										if(!exists)
											document.choseform.codeselect.options[document.choseform.codeselect.options.length]= new Option(infdata[row]["speciality_code"],infdata[row]["speciality_code"],false,ifchosen);
										}
									}
									chosengroups=[];
							$('.codelist').trigger('chosen:updated');	
							
		}).on('change', changegrouplist);
		
		$('.specialitylist').on('change', function(event)
		{
			var element = $('.specialitylist').val();
			if(element!=null)
			{
			var codeelement = Array(infdata.length);
			for(var ele=0; ele<=element.length; ele++)
				for(var row in infdata)
				{
					if(infdata[row]["speciality_name"]==element[ele])
					{
						codeelement.push(infdata[row]["speciality_code"]);
						console.log(codeelement[ele]);
					}
				}

				$('.codelist').val(codeelement);
			}
			else
			{
				$('.codelist').val("");
			}
				$('.codelist').trigger('chosen:updated');
				
		}).on('change', changegrouplist);
		
		$('.codelist').on('change', function(event)
		{
			var element = $('.codelist').val();
			if(element!=null)
			{
			var specialityelement = Array(element.length);
			for(var ele=0; ele<=element.length; ele++)
				for(var row in infdata)
				{
					if(infdata[row]["speciality_code"]==element[ele])
					{
						specialityelement[ele]=infdata[row]["speciality_name"];
						console.log(specialityelement[ele]);
						break;
					}
				}
				var element = $('.specialitylist').val("");
				$('.specialitylist').val(specialityelement);
			}
			else
			{
				$('.specialitylist').val("");
			}
				$('.specialitylist').trigger('chosen:updated');
				
		}).on('change', changegrouplist);
		
		$('.kurslist').on('change', changegrouplist);

	jQuery('select').chosen({
      no_results_text: "Oops, nothing found!",
	  display_disabled_options:false
    });
		form.on('submit', function(event)
			{
				event.preventDefault();
				console.log($('.grouplist').val());
				var teachers;
				var rooms;
				var disciplines;
				var groups = $('.grouplist').val();
		$.when($.ajax({
						type:'post',
						url:'scheduleteachers.php',
						data:  
						{
						Groups_name: JSON.stringify(groups)
						},
						cache:false
					  }).done(function(data)
					  {
						  teachers=data;
						  console.log(teachers);
					  }), 				
					  $.ajax({
						type:'post',
						url:'scheduledisciplines.php',
						data:  
						{
						Groups_name: JSON.stringify(groups)
						},
						cache:false
					  }).done(function(data)
					  {
						  disciplines=data;
						  console.log(disciplines);
					  }),
					  $.ajax({
						type:'post',
						url:'schedulerooms.php',
						data:  
						{
						Groups_name: JSON.stringify(groups)
						},
						cache:false
					  }).done(function(data)
					  {
						  rooms=data;
						  console.log(rooms);
					  }))
					  .then(function(){
				$.ajax({
						type:'post',
						url:'scheduleconnect.php',
						data:  
						{
						Groups_name: JSON.stringify(groups)
						},
						cache:false
					  }).done(function(data)
								{
									$('.scheduleform').empty();
									$('.chooseform').toggle();
									
									
									var matrix = [];
									var maxstartpair;
									for(var day=1; day<7; day++)
									{
										maxendpair = maxEndPair(data, day);
										matrix[day] = [];
										console.log(maxendpair);
										for(var pair=0; pair<maxendpair; pair++)									
										{
											matrix[day][pair] = [];
											for(var group=0; group<groups.length; group++)
												matrix[day][pair][group] = 
												{
													free: true,
													group: []
												};
										}
									}
									
									for(var row in data)
									{
										var gid = groupid(groups, data[row]["groupname"]);

										if(data[row]["Appointment_ID"]==248)
console.log("------------------->>>>>>>" + data[row]["Appointment_ID"]);
										if(matrix[data[row]["weekday"]][data[row]["StartPair"]][gid].free)
										{
											//var obj;
											var length;
											for(var startPair = data[row]["StartPair"]; startPair<parseInt(data[row]["EndPair"],10); startPair++)
											{
												length = matrix[data[row]["weekday"]][startPair][gid].group.length;
												matrix[data[row]["weekday"]][startPair][gid].group[length] = (
											{
													groupname: data[row]["groupname"],
													disciplines: getdisciplines(data[row]["Appointment_ID"], disciplines),
													rooms: getrooms(data[row]["Appointment_ID"], rooms),
													teachers: getteachers(data[row]["Appointment_ID"], teachers),
													subgroup: data[row]["SubGroup"],
													totalsubgroups: data[row]["TotalSubgroups"],
													weekday: weekday(data[row]["weekday"]),
													periodicity: data[row]["periodicity"],
													StartPair: data[row]["StartPair"],
													EndPair: data[row]["EndPair"],
													Appointment_ID: data[row]["Appointment_ID"],
													HalfStartPair: data[row]["HalfStartPair"],
													HalfEndPair: data[row]["HalfEndPair"],
													displayed: false
											});
												
												if((matrix[data[row]["weekday"]][startPair][gid].group[length].periodicity==0)&&(!matrix[data[row]["weekday"]][startPair][gid].group[length].subgroup))
												matrix[data[row]["weekday"]][data[row]["StartPair"]][gid].free=false;
											}
										}
											
									}

									console.log(matrix);
									var h = $('<div class="h" style="border:0">');
									$('.scheduleform').append(h);
									//var div = $('<div class="upperleftcorner">');
									$('.h').append($('<div class="scheduleheader" style="text-align: center">')
									.html("Расписание для групп: " + getgroups())
									.append($('<p>')
									.html("специальности: " + getspecialities(data))));
									
										var widthprocents = 96;
										if(groups.length>0)
										widthprocents = widthprocents/groups.length;
									var days = ["ПН","ВТ","СР","ЧТ","ПТ","СБ"];
									for(var day=1; day<7; day++)
									{
										dayid=day-1;
										var stringday ='<div id="day'+dayid+'">';
										$('.scheduleform').append($(stringday));
										maxendpair = maxEndPair(data, day);
										maxstartpair = maxStartPair(data, day);
										stringday ='#day'+dayid;
										$(stringday).append($('<div class="day">').html(days[dayid]));
										var divgroupname = '<div class="groupname" style="width: '+ widthprocents +'%">';
										for(var element in groups)
										{
											$(stringday).append($(divgroupname).html(groups[element]));
										}
										for(var pair=0; pair<maxendpair; pair++)									
										{
											var stringpair = '<div class="pair">';
											if(pair%2==0)
											$(stringday).append($(stringpair).html(pair/2));
												for(var group=0; group<groups.length; group++)
												{					
														if(pair%2==0)
														$(stringday).append($('<div class="nvalue" style="width:' + widthprocents + '%">'));	
													if(matrix[day][pair][group].group.length!=0)
													{
														//stringgrapp = '#grapp' + day + pair + group;
														var uniheight = 60;//parseFloat($('.pair').css('height'))
														var uniwidth = parseFloat($('.groupname').css('width'));
														var index=0;
														for(var elem in matrix[day][pair][group].group)
														{
															var element = matrix[day][pair][group].group[elem];
															if(element.displayed)
																continue;
															index++;
															if(element.subgroup)
															{
																element.displayed = true;
																console.log("1: " + element);
																if(element.periodicity==0)
																{
																	console.log("5: " + element);
																	var increment=1;
																	for(var p = pair+1; p<element.EndPair; p++)
																	{
																		var found = false;
																		for(var e in matrix[day][p][group].group)
																		{
																			if(element.Appointment_ID==matrix[day][p][group].group[e].Appointment_ID)
																			{
																				increment++;
																				matrix[day][p][group].group[e].displayed=true;
																				found = true;
																				break;
																			}
																		}
																		if(!found)
																			break;
																	}
																	
																	var width = uniwidth/element.totalsubgroups;
																	//console.log(uniwidth);
																	var height = increment*uniheight;
																	var top = 21 + uniheight*pair;//parseFloat($('.groupname').css("height"))
																	var left = parseFloat($('.pair').css("width")) + group*uniwidth + (element.subgroup-1)*(width);
																	console.log(left+ element.disciplines +' ' + element.subgroup + ' ' + element.periodicity);
																	var stringgrapp = '<div class="grapp" id="grapp' + day + '-' + pair + '-' + group + '-' + index + '">';
																	$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms))));																		
																	stringgrapp='#grapp' + day + '-' + pair + '-' + group + '-' + index;
																	$(stringgrapp).on("click",element,fullshow);
																}
																else
																{
																	console.log("6: " + element);
																	var obj2=null;
																	for(var elem in matrix[day][pair][group].group)
																	{
																		var element2 = matrix[day][pair][group].group[elem];
																		
																		if((element.subgroup == element2.subgroup||(element2.subgroup==null && element2.periodicity!=element.periodicity))&&(element.Appointment_ID != element2.Appointment_ID))//(element.subgroup == element2.subgroup||(element2.subgroup==null && element2.periodicity!=element.periodicity)) &&
																			obj2 = matrix[day][pair][group].group[elem];
																	}
																			console.log(obj2);
																			
																			if(obj2!=null)
																			{
																				console.log("7: " + element);
																				var increment=1;
																				for(var p = pair+1; p<element.EndPair; p++)
																				{
																					var found = false;
																					for(var e in matrix[day][p][group].group)
																					{
																						var obj3;
																						for(var elem in matrix[day][p][group].group)
																							if(obj2.subgroup == matrix[day][p][group].group[elem].subgroup && obj2.Appointment_ID == matrix[day][p][group].group[elem].Appointment_ID)
																								obj3 = matrix[day][p][group].group[elem];
																						console.log(obj3);
																						if(!obj3)
																							break;
																						if(element.Appointment_ID==matrix[day][p][group].group[e].Appointment_ID && obj2.Appointment_ID==obj3.Appointment_ID)
																						{
																							increment++;
																							matrix[day][p][group].group[e].displayed=true;
																							found = true;
																							break;
																						}								
																					}
																					if(!found)
																					break;
																				}
																				var width = uniwidth/element.totalsubgroups;
																				
																				var height = (increment*uniheight)/2;
																				if(element.periodicity==1)
																					var top = 21 + uniheight*pair;
																				else
																					var top = 21 + uniheight*pair + height;
																				var left = parseFloat($('.pair').css("width")) + group*uniwidth + (element.subgroup-1)*(width);
																				console.log(left+ element.disciplines +' ' + element.subgroup + ' ' + element.periodicity);
																				var stringgrapp = '<div class="halfgrapp" id="grapp' + day + '-' + pair + '-' + group + '-' + index + '">';
																				var imgsize = height/3;
																				if(height<35)
																					if(element.periodicity==1)
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9, "padding":0}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numerator" src="Resources/numerator.png" alt="альтернативный текст"> '))));
																					else
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9, "border-top":0, "padding":0, "box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-moz-box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-webkit-border-radius":"0px", "-moz-border-radius":"0px"}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominator" src="Resources/denominator.png" alt="альтернативный текст"> '))));																	
																				else	
																					if(element.periodicity==1)
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numerator" src="Resources/numerator.png" alt="альтернативный текст"> '))));
																					else
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "border-top":0, "box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-moz-box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-webkit-border-radius":"0px", "-moz-border-radius":"0px"}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominator" src="Resources/denominator.png" alt="альтернативный текст"> '))));//.css({"width":imgsize,"height":imgsize})
																				stringgrapp='#grapp' + day + '-' + pair + '-' + group + '-' + index;
																				$(stringgrapp).on("click",element,fullshow);
																			}
																			else
																			{
																				console.log("8: " + element);
																				var increment=1;
																				for(var p = pair+1; p<element.EndPair; p++)
																				{
																					var found = false;
																					for(var e in matrix[day][p][group].group)
																					{
																						var obj3=null;
																						for(var elem in matrix[day][p][group].group)
																						{
																							var element2 = matrix[day][p][group].group[elem];
																							console.log(element.subgroup + " == " + element2.subgroup + " && " + element.Appointment_ID + " != " + element2.Appointment_ID + " ?");
																							if(element.subgroup == element2.subgroup && element.Appointment_ID != element2.Appointment_ID)
																								obj3 = matrix[day][p][group].group[elem];
																						}
																						console.log(obj3);
																						var element2 = matrix[day][p][group].group[e];
																						console.log(element.Appointment_ID + " == " + element2.Appointment_ID + " && " + " !" + obj3 + " ?");
																						if(element.Appointment_ID==element2.Appointment_ID && !obj3)
																						{
																							increment++;
																							console.log(increment);
																							matrix[day][p][group].group[e].displayed=true;
																							found = true;
																							break;
																						}																							
																					}
																					if(!found)
																					break;
																				}			
																				var width = uniwidth/element.totalsubgroups;
																				
																				var height = increment*uniheight;
																				var top = 21 + uniheight*pair;
																				var left = parseFloat($('.pair').css("width")) + group*uniwidth + (element.subgroup-1)*(width);
																				console.log(left+ element.disciplines +' ' + element.subgroup + ' ' + element.periodicity);
																				var stringgrapp = '<div class="grapp" id="grapp' + day + '-' + pair + '-' + group + '-' + index + '">';
																				var imgsize = height/3;
																				if(height<35)
																					if(element.periodicity==1)
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numeratoronly" src="Resources/numeratoronly.png" alt="альтернативный текст"> '))));
																					else
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominatoronly" src="Resources/denominatoronly.png" alt="альтернативный текст"> '))));																	
																				else	
																					if(element.periodicity==1)
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numeratoronly" src="Resources/numeratoronly.png" alt="альтернативный текст"> '))));
																					else
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominatoronly" src="Resources/denominatoronly.png" alt="альтернативный текст"> '))));
																				stringgrapp='#grapp' + day + '-' + pair + '-' + group + '-' + index;
																				$(stringgrapp).on("click",element,fullshow);
																			}
																}
															}
															else
															{//целые группы и потоковые занятия
																element.displayed = true;
																console.log("2: ", element);
																if(element.periodicity==0)
																{
																	console.log("3: " + element);
																	var applength=0;
																	var increment=1;
																	for(var gr = group; gr<groups.length; gr++)
																	{
																			if(!findinmatrix(element,matrix[day][pair][gr]))
																				break;
																		increment=1;
																		applength++;
																		findme(element,matrix[day][pair][gr]).displayed=true;
																		for(var p = pair+1; p<element.EndPair; p++)
																		{
																			var found = false;
																				if(findinmatrix(element,matrix[day][p][gr]))
																				{
																					increment++;
																					console.log("ИНКРЕМЕНТ УВЕЛиЧЕН!!!!!!!!!!!!!!!!!");
																					findme(element,matrix[day][p][gr]).displayed=true;
																					found = true;
																				}	
																			if(!found)
																				break;
																		}
																	}
																		var width = uniwidth*applength;
																		
																		var height = increment*uniheight;
																		var top = 21 + uniheight*pair;
																		var left = parseFloat($('.pair').css("width")) + group*uniwidth;
																		console.log(left+ element.disciplines +' ' + element.subgroup + ' ' + element.periodicity);
																		var stringgrapp = '<div class="grapp" id="grapp' + day + '-' + pair + '-' + group + '-' + index + '">';
																		$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<span class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms))));																		
																		stringgrapp='#grapp' + day + '-' + pair + '-' + group + '-' + index;
																	$(stringgrapp).on("click",element,fullshow);
																}
																else
																{
																	console.log("4: ", element);
																	
																	var obj2=null;
																	for(var elem in matrix[day][pair][group].group)
																	{
																		var element2 = matrix[day][pair][group].group[elem];
																		
																		if((element.Appointment_ID != element2.Appointment_ID)) 
																			obj2 = matrix[day][pair][group].group[elem];
																	}
																			console.log(obj2);
																			
																			if(obj2!=null)
																			{
																				var applength=0;
																				var increment=1;
																				for(var gr = group; gr<groups.length; gr++)
																				{
																																						
																					if(!(findinmatrix(element,matrix[day][pair][gr])&&findinmatrix(obj2,matrix[day][pair][gr])))
																						break;
																					
																					increment=1;
																					applength++;
																					for(var p = pair+1; p<element.EndPair; p++)
																					{
																								var found = false;
																								
																									if(!findinmatrix(obj2,matrix[day][p][group]))
																										break;
																									if(findinmatrix(element,matrix[day][p][group]) && findinmatrix(obj2,matrix[day][p][group]))
																									{
																										increment++;
																										console.log("ИНКРЕМЕНТ УВЕЛиЧЕН!!!!!!!!!!!!!!!!!");
																										
																										findme(element,matrix[day][p][group]).displayed=true;
																										found = true;
																									}			
																								if(!found)
																								break;
																					}
																				}
																				var width = uniwidth*applength;
																				console.log(uniwidth + " applength:" + applength, element);
																				var height = (increment*uniheight)/2;
																				console.log("HEIGHT: ",height, " ", increment, " ", uniheight);
																				if(element.periodicity==1)
																					var top = 21 + uniheight*pair;
																				else
																					var top = 21 + uniheight*pair + height;
																				var left = parseFloat($('.pair').css("width")) + group*uniwidth;
																				console.log(left+ element.disciplines + ' ' + element.subgroup + ' ' + element.periodicity);
																				var stringgrapp = '<div class="halfgrapp" id="grapp' + day + '-' + pair + '-' + group + '-' + index + '">';
																				var imgsize = height/3;
																				if(height<35)
																					if(element.periodicity==1)
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9, "padding":0}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numerator" src="Resources/numerator.png" alt="альтернативный текст"> '))));
																					else
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9, "border-top":0, "padding":0, "box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-moz-box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-webkit-border-radius":"0px", "-moz-border-radius":"0px"}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominator" src="Resources/denominator.png" alt="альтернативный текст"> '))));																	
																				else	
																					if(element.periodicity==1)
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numerator" src="Resources/numerator.png" alt="альтернативный текст"> '))));
																					else
																						$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "border-top":0, "box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-moz-box-shadow":"0px 7px 2px -5px #1A1A1A, inset 0px 0px 0px #050000", "-webkit-border-radius":"0px", "-moz-border-radius":"0px"}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominator" src="Resources/denominator.png" alt="альтернативный текст"> '))));
																			stringgrapp='#grapp' + day + '-' + pair + '-' + group + '-' + index;
																			$(stringgrapp).on("click",element,fullshow);
																			}
																			else
																			{
																				console.log("3: " + element);
																				var applength=0;
																				var increment=1;
																				for(var gr = group; gr<groups.length; gr++)
																				{																				
																						if(!findinmatrix(element,matrix[day][pair][gr]))
																							break;
																					increment=1;
																					applength++;
																					findme(element,matrix[day][pair][gr]).displayed=true;
																					for(var p = pair+1; p<element.EndPair; p++)
																					{
																						var found = false;
																						
																							if(findinmatrix(element,matrix[day][p][gr])&&(matrix[day][p][gr].group.length<=1))
																							{
																								increment++;
																								console.log("ИНКРЕМЕНТ УВЕЛИЧЕН!!!!!!!!!!!!!!!!!");
																								findme(element,matrix[day][p][gr]).displayed=true;
																								found = true;
																								break;
																							}
																						
																						if(!found)
																							break;
																					}
																				}
																					var width = uniwidth*applength;
																					console.log('INCREMENT---------------------->>>>',increment);
																					console.log('uniheight---------------------->>>>',uniheight);
																					console.log('height---------------------->>>>',height);
																					var height = increment*uniheight;
																					var top =  21+ uniheight*pair;
																					console.log('uniheight---------------------->>>>',uniheight);
																					console.log('top---------------------->>>>',top);
																					var left = parseFloat($('.pair').css("width")) + group*uniwidth;
																					console.log(left+ element.disciplines +' ' + element.subgroup + ' ' + element.periodicity);
																					var stringgrapp = '<div class="grapp" id="grapp' + day + '-' + pair + '-' + group + '-' + index + '">';
																					var imgsize = height/3;
																					console.log('height---------------------->>>>',height);
																					if(height<35)
																						if(element.periodicity==1)
																								$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numeratoronly" src="Resources/numeratoronly.png" alt="альтернативный текст"> '))));
																							else
																								$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%', "font-size":9}).append($('<div class="halftext" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominatoronly" src="Resources/denominatoronly.png" alt="альтернативный текст"> '))));
																						else	
																							if(element.periodicity==1)
																								$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="numeratoronly" src="Resources/numeratoronly.png" alt="альтернативный текст"> '))));
																							else
																								$(stringday).append(($(stringgrapp).css({"width":width+'%', "height":height, "top":top, "left":left+'%'}).append($('<div class="text" style="border:0">').html(element.disciplines + '<br>' + element.teachers + '<br>' + element.rooms)).append($('<img class="denominatoronly" src="Resources/denominatoronly.png" alt="альтернативный текст"> '))));
																					stringgrapp='#grapp' + day + '-' + pair + '-' + group + '-' + index;
																					$(stringgrapp).on("click",element,fullshow);
																			}
																}															
															}
														}
													}
												}
											if(maxstartpair > maxendpair)
												for(var group=0; group<groups.length; group++)
													$(stringday).append($('<div class="nvalue" style="width:' + widthprocents + '%">'));											
										}
									}
									$('.scheduleform').append($('<div id="margin" style="height:20px">'));
									$('.scheduleform').toggle();
								});
					  });
			})
  }

  
function weekday(wd)
{
	if(wd=="1")
		return "Понедельник";
	if(wd=="2")
		return "Вторник";
	if(wd=="3")
		return "Среда";
	if(wd=="4")
		return "Четверг";
	if(wd=="5")
		return "Пятница";
	if(wd=="6")
		return "Суббота";
	return "Забыл";
} 
  
function fullshow(event)
{
	
	if($('.tip'))
		$('.tip').remove();
	console.log("1:", event.pageY, event.pageX, event.data);
	if(event.data.totalsubgroups)
	{
		if(event.data.periodicity==0)
		{
			$('body').append($('<div class="tip" >').css({"top":event.pageY,"left":event.pageX}).append($('<p>').html('Группа: '+event.data.groupname+'<br>'+'Подгруппа: '+event.data.subgroup+'<br>'+'День: '+event.data.weekday+'<br>'+'Продолжительность: ('+(event.data.StartPair/2)+' - '+(event.data.EndPair/2)+')<br>'+'Дисциплина: '+event.data.disciplines+'<br>'+'Преподаватель: '+event.data.teachers+'<br>'+'Аудитория: '+event.data.rooms)));
		}
		else
		{
			$('body').append($('<div class="tip" >').css({"top":event.pageY,"left":event.pageX}).append($('<p>').html('Группа: '+event.data.groupname+'<br>'+'Подгруппа: '+event.data.subgroup+'<br>'+'День: '+event.data.weekday+'<br>'+'Неделя: '+periodicity(event.data.periodicity)+'<br>'+'Продолжительность: ('+(event.data.StartPair/2)+' - '+(event.data.EndPair/2)+')<br>'+'Дисциплина: '+event.data.disciplines+'<br>'+'Преподаватель: '+event.data.teachers+'<br>'+'Аудитория: '+event.data.rooms)));
		}
	}
	else
	{
		if(event.data.periodicity==0)
		{
			$('body').append($('<div class="tip" >').css({"top":event.pageY,"left":event.pageX}).append($('<p>').html('Группа: '+event.data.groupname+'<br>'+'День: '+event.data.weekday+'<br>'+'Продолжительность: ('+(event.data.StartPair/2)+' - '+(event.data.EndPair/2)+')<br>'+'Дисциплина: '+event.data.disciplines+'<br>'+'Преподаватель: '+event.data.teachers+'<br>'+'Аудитория: '+event.data.rooms)));
		}
		else
		{
			$('body').append($('<div class="tip" >').css({"top":event.pageY,"left":event.pageX}).append($('<p>').html('Группа: '+event.data.groupname+'<br>'+'Неделя: '+periodicity(event.data.periodicity)+'<br>'+'День: '+event.data.weekday+'<br>'+'Продолжительность: ('+(event.data.StartPair/2)+' - '+(event.data.EndPair/2)+')<br>'+'Дисциплина: '+event.data.disciplines+'<br>'+'Преподаватель: '+event.data.teachers+'<br>'+'Аудитория: '+event.data.rooms)));
		}
	}
	$('.tip').on('click',function(){$(this).remove();})
	event.stopPropagation();
}

function periodicity(per)
{
	if(per==1)
		return 'числитель';
	if(per==2)
		return 'знаменатель';
	return null;
}

function getClickPosition(event) {
	console.log("2: ", event);
    var parentPosition = getPosition(event.currentTarget);
    var x = e.clientX - parentPosition.x;
    var y = e.clientY - parentPosition.y;
	return {x,y};
}
 
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
     console.log("3:", element, event); 
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}
  
function findinmatrix(element, mass)
{
	for(var elem in mass.group)
		if(element.Appointment_ID == mass.group[elem].Appointment_ID)
			return true;
		return false;
}  

function findme(element, mass)
{
  	for(var elem in mass.group)
		if(element.Appointment_ID == mass.group[elem].Appointment_ID)
			return mass.group[elem];
		return null;
}
  
function getspecialities(data)
{
	var string="";
	var more = false;
	for(var row in data)
		{
			var exists=false;
			for(var i=0; i<row; i++)
			if(data[i]["specialityname"].localeCompare(data[row]["specialityname"])==0)
			{
				exists=true;
				break;
			}
			if(!exists)
			{
			if(more) 
			string = string + ', ';
			string = string + data[i]["specialityname"];
			more=true;
			}
		}
		return string;
}
  
 function getgroups() 
 {
	 var string="";
	 var more = false;
	 for(var elem in $('.grouplist').val())
	 {
		if(more) 
			string = string + ', ';
			string = string + $('.grouplist').val()[elem];
			more=true;
	 }
	 return string;
 }
  
function maxEndPair(data,day)
{
	var i=8;
	for(var row in data)
		if((i<parseInt(data[row]["EndPair"],10))&&(data[row]["weekday"]==day))
			i=parseInt(data[row]["EndPair"],10);
		return i;
} 
  
function maxStartPair(data,day)
{
	var i=8;
	for(var row in data)
		if((i<parseInt(data[row]["StartPair"],10))&&(data[row]["weekday"]==day))
			i=parseInt(data[row]["StartPair"],10);
		return i;
}
  
  function getdisciplines(appointment_id, disciplines)
  {
	  var string="";
	  var more = false;
	  for(var row in disciplines)
		  if(disciplines[row]["Appointment_ID"]==appointment_id)
		  {
			if(more) 
			string = string + ',';
			string = string + disciplines[row]["name"] 
			more=true;
		  }
		return string;
  }
  
  function getrooms(appointment_id, rooms)
  {
	  var string="";
	  var more = false;
	  for(var row in rooms)
		  if(rooms[row]["Appointment_ID"]==appointment_id)
		  {
			if(more) 
			string = string + ',';
			string = string + rooms[row]["name"];
			if(rooms[row]["abr"]!="С")
			string = string + rooms[row]["abr"];
			more=true;
		  }
		return string;
  }
  
  function getteachers(appointment_id, teachers)
  {
	  var string="";
	  var more = false;
	  for(var row in teachers)
		  if(teachers[row]["Appointment_ID"]==appointment_id)
		  {
			if(more) 
			string = string + ',';
			string = string + abr(teachers[row]["name"]) + " " + teachers[row]["lastname"] + " " + abrname(teachers[row]["firstname"]) + "" + abrname(teachers[row]["middlename"]);
			more=true;
		  }
		return string;
  } 
  
  function abr(string)
  {
	  if(!string.localeCompare("доцент"))
		  return "доц.";
	  if(!string.localeCompare("старший преподаватель"))
		  return "ст.п.";
	  if(!string.localeCompare("преподаватель"))
		  return "п.";
	  if(!string.localeCompare("ассистент"))
		  return "асс.";
	  if(!string.localeCompare("профессор"))
		  return "пр.";
	  if(!string.localeCompare("профессор каф.экономики и управления"))
		  return "пр.";
	  if(!string.localeCompare("доцент КФК"))
		  return "доц.";
	  return "";
  }
  
  function abrname(string)
  {
		return string.substr(0,1) + ".";
  }
  
  function groupid(groups, group)
  {
	  for(var g in groups)
		  if(group==groups[g])
			  return g;
		console.log("Не нашел");
		return 0;
  }
  
  function ischosengroups(chosengroups, addinggroup)
  {
	for(var element in chosengroups)
		if(!chosengroups[element].localeCompare(addinggroup))
		return true;
	return false;
  }
  
  function changegrouplist()
  {
							var choseninstituts = $('.institutelist').val();
							if (!choseninstituts)
							{
								choseninstituts = [];
								$('.institutelist option').each(function()
								{
									choseninstituts.push($(this).val());
									console.log(choseninstituts);
								})
							}
							
							var chosencodes = $('.codelist').val();
							if (!chosencodes)
							{
								chosencodes = [];
								$('.codelist option').each(function()
								{
									chosencodes.push($(this).val());
								})
							}
							
							var chosenkurses = $('.kurslist').val();
							if (!chosenkurses)
							{
								chosenkurses  = [];
								$('.kurslist option').each(function()
								{
									chosenkurses.push($(this).val());
								})
							}
							var chosengroups = $('.grouplist').val();
							document.choseform.groupselect.options.length=1;
									for(var row in infdata)
									{
										var ifchosen = ischosengroups(chosengroups, infdata[row]["groups_name"]);
										if(ifchosen || (chosenkurses.indexOf(infdata[row]["kurs"])!=-1 && chosencodes.indexOf(infdata[row]["speciality_code"])!=-1 && choseninstituts.indexOf(infdata[row]["institute_name"])!=-1))
										{
											document.choseform.groupselect.options[document.choseform.groupselect.options.length]= new Option(infdata[row]["groups_name"],infdata[row]["groups_name"],false,ifchosen);
										}
									}
									chosengroups=[];
							$('.grouplist').trigger('chosen:updated');
  }