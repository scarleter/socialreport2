<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }
    
    public function loadview($content = '', $data = '') {
        
        $header = $this->load->view('pages/general/header', NULL, true);
        $main_footer = $this->load->view('pages/general/main_footer', NULL, true);
        $main_sidebar = $this->load->view('pages/general/main_sidebar', NULL, true);
        
        $this->load->view('pages/general/base', array('header' => $header, 'content' => $content, 'main_footer' => $main_footer, 'main_sidebar' => $main_sidebar));
    }

}
