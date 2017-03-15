<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Facebookdata extends MY_Controller {
    
    public function __construct() {
        parent::__construct();
    }
    
    //input attributes of data `attrs` which can be array or object or string to get data in json
    
    //if `attrs` not be array or object or string or false ,else return empty object
    //case `attrs` be object convert `attrs.value` to array
    //case `attrs` be string convert `attrs` to array
    
	public function get(){
		
	}
}
