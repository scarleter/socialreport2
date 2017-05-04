<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include './admin/third_party/PHPExcel/Classes/PHPExcel/IOFactory.php';
include './admin/third_party/PHPExcel/Classes/PHPExcel.php';
include './admin/third_party/PHPExcel/Classes/PHPExcel/Cell/IValueBinder.php';

class ExcelTemplate {
    
    public function __construct($param) {
        //default setting
        $this->outputFileRoot = './public/excelOutput/';
        $this->downloadUrlRoot = 'http://project.my-magazine.me/socialreport/public/excelOutput/';
        $this->excelName = isset($param['excelName']) ? $param['excelName'] : 'excel';
        $this->suffix = '.xlsx';
        
        $this->templateReader = PHPExcel_IOFactory::createReader('Excel2007');
        $this->template = $this->templateReader->load($param['templatePath']);
        $this->resultExcel = new PHPExcel();
        $this->destinationSheet = $this->resultExcel->getSheet(0);
    }
    
    public function fillDataFromTplSheet($destinationStartCol, $destinationStartRow, $sourceSheet, $sourceStartCol, $sourceStartRow, $filledData){   
        //change to column index
        $destinationStartCol = PHPExcel_Cell::columnIndexFromString($destinationStartCol) -1;
        $sourceStartCol = PHPExcel_Cell::columnIndexFromString($sourceStartCol) - 1;
        
        $destinationCurrentCol = $destinationStartCol;
        $destinationCurrentRow = $destinationStartRow;
        
        $sourceMerge = $sourceSheet->getMergeCells();
        //loop to merge in destinationSheet
        foreach($sourceMerge as $cells){
            list($cells,) = PHPExcel_Cell::splitRange($cells);
            $sourceFirst = $cells[0];
            $sourceLast  = $cells[1];
            list($sfc, $sfr) = PHPExcel_Cell::coordinateFromString($sourceFirst);
            $sfc = PHPExcel_Cell::columnIndexFromString($sfc) - 1;
            list($slc, $slr) = PHPExcel_Cell::coordinateFromString($sourceLast);
            $slc = PHPExcel_Cell::columnIndexFromString($slc) - 1;
            
            //calculate destination coordinate
            $dfc = $destinationCurrentCol - $sourceStartCol + $sfc;
            $dfc = PHPExcel_Cell::stringFromColumnIndex($dfc);
            $dfr = $destinationStartRow - $sourceStartRow + $sfr;
            $destinationFirst = $dfc.$dfr;
            $dlc = $destinationCurrentCol - $sourceStartCol + $slc;
            $dlc = PHPExcel_Cell::stringFromColumnIndex($dlc);
            $dlr = $destinationStartRow - $sourceStartRow + $slr;
            $destinationLast = $dlc.$dlr;
            //merge destinationSheet cell
            $this->destinationSheet->mergeCells($destinationFirst.':'.$destinationLast);
        }

        
        //loop all row
        foreach ($sourceSheet->getRowIterator() as $sourceCurrentRow) {
            //get all columns
            $sourceCellIterator = $sourceCurrentRow->getCellIterator();
            // Loop all cells, even if it is not set 
            $sourceCellIterator->setIterateOnlyExistingCells(false);
            //loop all column
            foreach ($sourceCellIterator as $sourceCell) {
                $sourceCellText = $sourceCell->getValue();
                $sourceCellStyle = $sourceCell->getStyle($sourceCell);
                $sourceCellCoordinate = $sourceCell->getCoordinate();
                $sourceCurrentColumn = $sourceCell->getColumn();
                $sourceCurrentColumn = PHPExcel_Cell::columnIndexFromString($sourceCurrentColumn) - 1;
                $sourceCurrentRow = $sourceCell->getRow();
                
                
                //calculate destination coordinate
                $destinationCurrentCol = $destinationStartCol - $sourceStartCol + $sourceCurrentColumn;
                $destinationCurrentCol = PHPExcel_Cell::stringFromColumnIndex($destinationCurrentCol);
                $destinationCurrentRow = $destinationStartRow - $sourceStartRow + $sourceCurrentRow;
                $destinationCellCoordinate = $destinationCurrentCol.$destinationCurrentRow;
                //set to destination sheet
                //$this->destinationSheet->duplicateStyle($sourceCellStyle, $destinationCellCoordinate);

                if($sourceCellText){
                    $text = $sourceCellText;
                    if(preg_match('/%[A-Z_]+%/', $sourceCellText, $matches)){
                        $tplVariable = $matches[0];
                        if(isset($filledData -> $tplVariable)){
                            $text = str_replace($tplVariable, $filledData -> $tplVariable, $text);
                        }else{
                            $text = str_replace($tplVariable, '--', $text);
                        }
                    } 
                    //$text = $sourceCellText
                    $this->destinationSheet->setCellValue($destinationCellCoordinate, $text);
                }
            }  
        }  
        
        $destinationCurrentCol = PHPExcel_Cell::columnIndexFromString($destinationCurrentCol) - 1;
        $destinationCurrentCol = PHPExcel_Cell::stringFromColumnIndex($destinationCurrentCol + 1);
         
        return array('destinationHighestCol' => $destinationCurrentCol, 'destinationHighestRow' => ($destinationCurrentRow + 1));
    }
    
    public function addStyle(){
        $this->destinationSheet->getDefaultStyle()->applyFromArray(array(
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER, 
                'vertical' => PHPExcel_Style_Alignment::VERTICAL_CENTER)
        ));
    }
    
    
    public function outputExcel() {
        $this->addStyle();
        
        $resultPath = $this->outputFileRoot.$this->excelName.$this->suffix;
           
        $resultWriter = PHPExcel_IOFactory::createWriter($this->resultExcel, 'Excel2007');
        $resultWriter->save($resultPath);
    }
}
