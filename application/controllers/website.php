<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Website extends MY_Controller {
    
    public function __construct() {
        parent::__construct();
    }

	public function postDataLegacyView(){
        $data = array();
        $data['pageId'] = FACEBOOK_WEBSITE_PAGEID;
        $data['pageAccessToken'] = FACEBOOK_WEBSITE_PAGE_ACCESS_TOKEN;
        $content = $this->load->view('pages/general/content/postDataLegacyView', $data, true);
		$this->loadview($content);
	}
    
	public function dataCompare(){
        $data = array();
        $data['websiteName'] = FACEBOOK_WEBSITE_NAME;
        $data['pageId'] = FACEBOOK_WEBSITE_PAGEID;
        $data['pageAccessToken'] = FACEBOOK_WEBSITE_PAGE_ACCESS_TOKEN;
        $content = $this->load->view('pages/general/content/dataCompare', $data, true);
		$this->loadview($content);
	}
}
