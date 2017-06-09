import angular from 'angular';
import { ifEnv } from 'directives/if-env';

export default angular.module('KickTest1.directives', [])
  .directive('ifEnv', ifEnv);
