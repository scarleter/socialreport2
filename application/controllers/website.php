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
    
    public function generateWeeklyReportExcel(){
        $weeklyReportData = json_decode($_POST['weeklyReportData']);
        $excelName = $_POST['excelName'];
        $destinationHighestCoordinate = array('destinationHighestCol' => 'A', 'destinationHighestRow' => '1');
        $this->load->library('ExcelTemplate', array('templatePath' => './admin/views/excelTemplate/FacebookWeeklyReportTemplate.xlsx', 'excelName' => $excelName));
        $exceltemplate = $this->exceltemplate;

        foreach($weeklyReportData as $weeklyReportDataKey => $weeklyReportDataValue){        
            $header = $weeklyReportDataValue -> header;
            $postLogData = $weeklyReportDataValue -> postLogData;
            $footer = $weeklyReportDataValue -> footer;

            //add 5 more rows when create a new weekly report below the previous one
            if($weeklyReportDataKey != 0){
                $destinationHighestCoordinate['destinationHighestRow'] += 5;
            }

            //fill header
            $destinationHighestCoordinate = $exceltemplate->fillDataFromTplSheet('A', $destinationHighestCoordinate['destinationHighestRow'], $exceltemplate->template->getSheet(0), 'A', 1, $header);

            //loop to fill postLog content
            foreach($postLogData as $postLogDataKey => $postLogDataValue){
                $destinationHighestCoordinate = $exceltemplate->fillDataFromTplSheet('A', $destinationHighestCoordinate['destinationHighestRow'], $exceltemplate->template->getSheet(1), 'A', 1, $postLogDataValue);
            }

            //fill footer
            $destinationHighestCoordinate = $exceltemplate->fillDataFromTplSheet('A', $destinationHighestCoordinate['destinationHighestRow'], $exceltemplate->template->getSheet(2), 'A', 1, $footer);
        }
        
        //generate excel in server
        $exceltemplate->outputExcel();
        
        echo json_encode(array('downloadUrl' => $exceltemplate->downloadUrlRoot.$exceltemplate->excelName.$exceltemplate->suffix)); 
    }
}
