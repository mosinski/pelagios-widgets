define(["jquery"],function($){(function($){$.PaginationCalculator=function(maxentries,opts){this.maxentries=maxentries,this.opts=opts},$.extend($.PaginationCalculator.prototype,{numPages:function(){return Math.ceil(this.maxentries/this.opts.items_per_page)},getInterval:function(current_page){var ne_half=Math.floor(this.opts.num_display_entries/2),np=this.numPages(),upper_limit=np-this.opts.num_display_entries,start=current_page>ne_half?Math.max(Math.min(current_page-ne_half,upper_limit),0):0,end=current_page>ne_half?Math.min(current_page+ne_half+this.opts.num_display_entries%2,np):Math.min(this.opts.num_display_entries,np);return{start:start,end:end}}}),$.PaginationRenderers={},$.PaginationRenderers.defaultRenderer=function(maxentries,opts){this.maxentries=maxentries,this.opts=opts,this.pc=new $.PaginationCalculator(maxentries,opts)},$.extend($.PaginationRenderers.defaultRenderer.prototype,{createLink:function(page_id,current_page,appendopts){var lnk,np=this.pc.numPages();return page_id=page_id<0?0:page_id<np?page_id:np-1,appendopts=$.extend({text:page_id+1,classes:""},appendopts||{}),page_id==current_page?lnk=$("<span class='current'>"+appendopts.text+"</span>"):lnk=$("<a>"+appendopts.text+"</a>").attr("href",this.opts.link_to.replace(/__id__/,page_id)),appendopts.classes&&lnk.addClass(appendopts.classes),lnk.data("page_id",page_id),lnk},appendRange:function(container,current_page,start,end,opts){var i;for(i=start;i<end;i++)this.createLink(i,current_page,opts).appendTo(container)},getLinks:function(current_page,eventHandler){var begin,end,interval=this.pc.getInterval(current_page),np=this.pc.numPages(),fragment=$("<div class='pagination'></div>");return this.opts.prev_text&&(current_page>0||this.opts.prev_show_always)&&fragment.append(this.createLink(current_page-1,current_page,{text:this.opts.prev_text,classes:"prev"})),interval.start>0&&this.opts.num_edge_entries>0&&(end=Math.min(this.opts.num_edge_entries,interval.start),this.appendRange(fragment,current_page,0,end,{classes:"sp"}),this.opts.num_edge_entries<interval.start&&this.opts.ellipse_text&&$("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment)),this.appendRange(fragment,current_page,interval.start,interval.end),interval.end<np&&this.opts.num_edge_entries>0&&(np-this.opts.num_edge_entries>interval.end&&this.opts.ellipse_text&&$("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment),begin=Math.max(np-this.opts.num_edge_entries,interval.end),this.appendRange(fragment,current_page,begin,np,{classes:"ep"})),this.opts.next_text&&(current_page<np-1||this.opts.next_show_always)&&fragment.append(this.createLink(current_page+1,current_page,{text:this.opts.next_text,classes:"next"})),$("a",fragment).click(eventHandler),fragment}}),$.fn.pagination=function(maxentries,opts){function paginationClickHandler(evt){evt.preventDefault();var links,new_current_page=$(evt.target).data("page_id"),continuePropagation=selectPage(new_current_page);return continuePropagation||evt.stopPropagation(),continuePropagation}function selectPage(new_current_page){containers.data("current_page",new_current_page),links=renderer.getLinks(new_current_page,paginationClickHandler),containers.empty(),links.appendTo(containers);var continuePropagation=opts.callback(new_current_page,containers);return continuePropagation}opts=$.extend({items_per_page:10,num_display_entries:11,current_page:0,num_edge_entries:0,link_to:"#",prev_text:"Prev",next_text:"Next",ellipse_text:"...",prev_show_always:!0,next_show_always:!0,renderer:"defaultRenderer",show_if_single_page:!1,load_first_page:!0,callback:function(){return!1}},opts||{});var containers=this,renderer,links,current_page;current_page=parseInt(opts.current_page),containers.data("current_page",current_page),maxentries=!maxentries||maxentries<0?1:maxentries,opts.items_per_page=!opts.items_per_page||opts.items_per_page<0?1:opts.items_per_page;if(!$.PaginationRenderers[opts.renderer])throw new ReferenceError("Pagination renderer '"+opts.renderer+"' was not found in jQuery.PaginationRenderers object.");renderer=new $.PaginationRenderers[opts.renderer](maxentries,opts);var pc=new $.PaginationCalculator(maxentries,opts),np=pc.numPages();containers.bind("setPage",{numPages:np},function(evt,page_id){if(page_id>=0&&page_id<evt.data.numPages)return selectPage(page_id),!1}),containers.bind("prevPage",function(evt){var current_page=$(this).data("current_page");return current_page>0&&selectPage(current_page-1),!1}),containers.bind("nextPage",{numPages:np},function(evt){var current_page=$(this).data("current_page");return current_page<evt.data.numPages-1&&selectPage(current_page+1),!1}),links=renderer.getLinks(current_page,paginationClickHandler),containers.empty(),(np>1||opts.show_if_single_page)&&links.appendTo(containers),opts.load_first_page&&opts.callback(current_page,containers)}})(jQuery)})