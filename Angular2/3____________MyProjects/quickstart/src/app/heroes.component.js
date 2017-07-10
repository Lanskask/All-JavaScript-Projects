"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var hero_service_1 = require("./hero.service");
var HeroesComponent = (function () {
    function HeroesComponent(_heroService) {
        this._heroService = _heroService;
    }
    HeroesComponent.prototype.ngOnInit = function () {
        this.getHeroes();
    };
    HeroesComponent.prototype.getHeroes = function () {
        var _this = this;
        this._heroService.getHeroes().then(function (heroes) { return _this.heroes = heroes; });
    };
    HeroesComponent.prototype.onSelect = function (hero) {
        this.selectedHero = hero;
    };
    return HeroesComponent;
}());
HeroesComponent = __decorate([
    core_1.Component({
        selector: 'my-heroes',
        template: "<h2>My Heroes</h2>\n\t\t\t\t<ul class=\"heroes\">\n\t\t\t\t  <li *ngFor=\"let hero of heroes\" (click)=\"onSelect(hero)\"\n\t\t\t\t  \t\t[class.selected]=\"hero === selectedHero\">\n\t\t\t\t\t   <span class=\"badge\">{{hero.id}}</span> {{hero.name}}\n\t\t\t\t  </li>\n\t\t\t\t</ul>\n\t\t\t\t<hero-detail [hero]=\"selectedHero\"></hero-detail>\n\t\t\t\t",
        inputs: ["parentData"],
        styles: ["\n\t\t  .selected {\n\t\t\tbackground-color: #CFD8DC !important;\n\t\t\tcolor: white;\n\t\t  }\n\t\t  .heroes {\n\t\t\tmargin: 0 0 2em 0;\n\t\t\tlist-style-type: none;\n\t\t\tpadding: 0;\n\t\t\twidth: 15em;\n\t\t  }\n\t\t  .heroes li {\n\t\t\tcursor: pointer;\n\t\t\tposition: relative;\n\t\t\tleft: 0;\n\t\t\tbackground-color: #EEE;\n\t\t\tmargin: .5em;\n\t\t\tpadding: .3em 0;\n\t\t\theight: 1.6em;\n\t\t\tborder-radius: 4px;\n\t\t  }\n\t\t  .heroes li.selected:hover {\n\t\t\tbackground-color: #BBD8DC !important;\n\t\t\tcolor: white;\n\t\t  }\n\t\t  .heroes li:hover {\n\t\t\tcolor: #607D8B;\n\t\t\tbackground-color: #DDD;\n\t\t\tleft: .1em;\n\t\t  }\n\t\t  .heroes .text {\n\t\t\tposition: relative;\n\t\t\ttop: -3px;\n\t\t  }\n\t\t  .heroes .badge {\n\t\t\tdisplay: inline-block;\n\t\t\tfont-size: small;\n\t\t\tcolor: white;\n\t\t\tpadding: 0.8em 0.7em 0 0.7em;\n\t\t\tbackground-color: #607D8B;\n\t\t\tline-height: 1em;\n\t\t\tposition: relative;\n\t\t\tleft: -1px;\n\t\t\ttop: -4px;\n\t\t\theight: 1.8em;\n\t\t\tmargin-right: .8em;\n\t\t\tborder-radius: 4px 0 0 4px;\n\t\t  }\n\t\t"],
    }),
    __metadata("design:paramtypes", [hero_service_1.HeroService])
], HeroesComponent);
exports.HeroesComponent = HeroesComponent;
//# sourceMappingURL=heroes.component.js.map