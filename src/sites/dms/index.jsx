import {Link} from 'react-router-dom'

import { dmsPageFactory, registerDataType } from "../../modules/dms/src"
import siteConfig from '../../modules/dms/src/patterns/page/siteConfig'
import Selector, { registerComponents } from "../../modules/dms/src/patterns/page/selector"
import ComponentRegistry from './component_registry'

registerDataType("selector", Selector)
registerComponents(ComponentRegistry)

const API_HOST = 'https://graph.availabs.org'

const dmsDocs = { 
  ...dmsPageFactory(
    siteConfig({
      app: "rgi",
      type: "foundation-aid",
      logo: <div className='flex items-center px-8 h-full text-lg font-bold' >FoundationAid</div>, 
      rightMenu:  <Link className='flex items-center px-8 text-lg font-bold h-12' to='/'> </Link>,
      baseUrl: "",
      API_HOST
    }
  ))
}



export default [
  dmsDocs
]
