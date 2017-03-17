<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Website extends MY_Controller {
    
    public function __construct() {
        parent::__construct();
    }

	public function index(){
        $data = array();
        $data['pageId'] = FACEBOOK_WEBSITE_PAGEID;
        $data['pageAccessToken'] = FACEBOOK_WEBSITE_PAGE_ACCESS_TOKEN;
        $content = $this->load->view('pages/general/content/postDataLegacyView', $data, true);
		$this->loadview($content);
	}
}
