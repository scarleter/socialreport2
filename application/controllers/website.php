<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Website extends MY_Controller {
    
    public function __construct() {
        parent::__construct();
    }

    public function postDataLegacyView(){
        $websiteFacebookId = FACEBOOK_WEBSITE_PAGEID;
        $websiteFacebookAccessToken = FACEBOOK_WEBSITE_PAGE_ACCESS_TOKEN;
        
        $data = array();
        $data['pageId'] = $websiteFacebookId;
        $data['pageAccessToken'] = $websiteFacebookAccessToken;
        $content = $this->load->view('pages/general/facebook/postDataLegacyView', $data, true);
		$this->loadview($content);
	}
    
    public function dataCompare(){
        $websiteName = FACEBOOK_WEBSITE_NAME;
        $websiteFacebookId = FACEBOOK_WEBSITE_PAGEID;
        $websiteFacebookAccessToken = FACEBOOK_WEBSITE_PAGE_ACCESS_TOKEN;
        
        $data = array();
        $data['websiteName'] = $websiteName;
        $data['pageId'] = $websiteFacebookId;
        $data['pageAccessToken'] = $websiteFacebookAccessToken;
        $data['pagesToWatchList'] = array();
        $data['pagesToWatchList'][$websiteFacebookId] = $websiteName;
        $pagesToWatchList = $this->pagestowatch_model->getlistbytype($websiteName);
        foreach($pagesToWatchList as $key => $value){
            $data['pagesToWatchList'][$value['pageID']] = $value['name'];
        }
        $data['pagesToWatchList'] = json_encode($data['pagesToWatchList']);
        $content = $this->load->view('pages/general/facebook/dataCompare', $data, true);
		$this->loadview($content);
	}
    
    public function postlog(){
        $websiteFacebookId = FACEBOOK_WEBSITE_PAGEID;
        $websiteFacebookAccessToken = FACEBOOK_WEBSITE_PAGE_ACCESS_TOKEN;
        
        $data = array();
        $data['pageId'] = $websiteFacebookId;
        $data['pageAccessToken'] = $websiteFacebookAccessToken;
        $content = $this->load->view('pages/general/facebook/postLog', $data, true);
		$this->loadview($content);
    }
}
