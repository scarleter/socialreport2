<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pagestowatch_model extends CI_Model
{
    private $table='pagestowatch';
    public function __construct() {
        parent::__construct();  
    }
    
    public function getlist()
    {
        $this->db->from($this->table);
        $this->db->select('id, name, pageID, type, sort');
        $this->db->order_by('sort','ASC');
        $query = $this->db->get();
        return $query->result_array();
    }
    
    public function getlistbytype($type)
    {
        $this->db->from($this->table);
        $this->db->where('type', $type);
        $this->db->select('id, name, pageID, sort');
        $this->db->order_by('sort','ASC');
        $query = $this->db->get();
        return $query->result_array();
    }
    
    public function editpage($id, $data)
    {
        $this->db->where('id', $id);
        $this->db->update($this->table, $data);
    }
    
    public function addpage($data)
    {
        $this->db->insert($this->table, $data);
    }
    
    public function deletepage($id)
    {
        $this->db->delete($this->table, array('id' => $id));
        
    }
    
}
