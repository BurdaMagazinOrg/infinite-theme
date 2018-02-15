// Loaded via infinite.info.yml

// infinite.header
import './utils/head-utils'

// infinite/swiper
import 'swiper'

// infinite.libs
import 'waypoints/lib/jquery.waypoints'
import './libs/shortcuts/infinite_custom' // TODO This is a modified library. Find a way to extract modifications.
import './libs/shortcuts/sticky'
import 'waypoints/lib/shortcuts/inview'
import 'script-loader!timeago'
import 'sticky-kit/dist/sticky-kit'
import './libs/jquery.inview' // Dependency of teaser-feed-view

// infinite.init

import './backbone-manager'
import './burda-infinite'
import './utils/base-utils'
// import './consts/app-config'
// import './consts/view-ids'
// import './consts/model-ids'
// import './consts/manager-ids'

// infinite.manager.*
// import './managers/tracking-manager'
// import './managers/scroll-manager'
// import './managers/marketing-manager'

// infinite.models.*
// import './models/base/base-model'
// import './models/base/base-collection-model'

import './models/ajax-model'
import './models/page-offsets-model'
import './models/device-model'
import './models/infinite-block-data-model'

// infinite.views.base.*
// import './views/base/base-view'
import './views/base/base-inview-view'
import './views/base/base-dynamic-view'
import './models/base/base-dynamic-view-model'
import './views/base/base-feed-view'
import './views/base/base-sidebar-view'
import './models/base/base-sidebar-model'
import './views/base/base-newsletter-view'
import './views/base/base-list-swipeable-view'

// infinite.views.*
import './views/main-view'
import './views/infinite-block-view'
import './views/menu-main-view'
import './views/menu-sidebar-view'
import './views/modal-search-view'
import './models/modal-search-model'
import './views/article-view'
import './views/gallery-view'
import './views/sticky-view'
// import './views/products/product-view'
// import './views/anchor-navigation-view'
import './views/marketing-view'
import './views/components/spinner-cube-view'
import './views/newsletter/hmnewsletter-view'
import './views/newsletter/newsletter-modal-view'

// General dependencies
import './views/products/product-view' // Dependency in base-dynamic-view-model and product-slider-view

// Loaded via templates
import './views/products/product-slider-view'

