<!-- Left side column. contains the logo and sidebar -->
<aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
        <!-- search form 
      <form action="#" method="get" class="sidebar-form">
        <div class="input-group">
          <input type="text" name="q" class="form-control" placeholder="Search...">
              <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
        </div>
      </form>-->
        <!-- /.search form -->
        <!-- sidebar menu: : style can be found in sidebar.less -->
        <ul class="sidebar-menu">
            <li class="header">FACEBOOK</li>
            <li class="treeview active">
                <a href="#">
                    <i class="fa fa-folder"></i> <span>website</span>
                    <span class="pull-right-container">
                      <i class="fa fa-angle-left pull-right"></i>
                    </span>
                </a>
                <ul class="treeview-menu">
                    <li><a href="<?= base_url() ?>website/postdatalegacyview"><i class="fa fa-table"></i>Post Data - Legacy View</a></li>
                    <li>
                        <a href="#">
                            <i class="fa fa-folder"></i>Pages To Watch
                            <span class="pull-right-container">
                              <i class="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                        <ul class="treeview-menu" style="display: none;">
                        </ul>
                    </li>
                    <li><a href="<?= base_url() ?>website/datacompare"><i class="fa fa-line-chart"></i>Data Compare</a></li>
                    <li><a href="<?= base_url() ?>website/postlog"><i class="fa fa-file-text-o"></i>Facebook Post Log</a></li>

                    <li><a href="<?= base_url() ?>website/setting"><i class="fa fa-gear"></i>Setting</a></li>
                </ul>
            </li>
        </ul>
    </section>
    <!-- /.sidebar -->
</aside>
