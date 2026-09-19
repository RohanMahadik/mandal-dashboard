import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VarganiComponent } from './pages/vargani/vargani.component';
import { KharchComponent } from './pages/kharch/kharch.component';
import { JamaKharchComponent } from './pages/jama-kharch/jama-kharch.component';
import { YearlyArchiveComponent } from './pages/yearly-archive/yearly-archive.component';
import { UtsavComponent } from './pages/utsav/utsav.component';
import { AboutComponent } from './pages/about/about.component';
import { ManogatComponent } from './pages/manogat/manogat.component';
import { UpkramComponent } from './pages/upkram/upkram.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'मुखपृष्ठ - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'vargani', component: VarganiComponent, title: 'वर्गणी यादी - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'kharch', component: KharchComponent, title: 'खर्च नोंदवही - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'jama-kharch', component: JamaKharchComponent, title: 'जमा - खर्च ताळेबंद - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'yearly-archive', component: YearlyArchiveComponent, title: 'वर्षनिहाय हिशोब - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'utsav', component: UtsavComponent, title: 'उत्सव व कार्यक्रम - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'gallery', component: GalleryComponent, title: 'छायाचित्र दालन - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'about', component: AboutComponent, title: 'मंडळाची माहिती व सभासद यादी - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'manogat', component: ManogatComponent, title: 'मनोगत - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'upkram', component: UpkramComponent, title: 'मंडळाचे उपक्रम - श्री अष्टविनायक मित्र मंडळ' },
  { path: 'connect', component: ConnectComponent, title: 'महत्त्वाचे संपर्क व सहकार्य केंद्र - श्री अष्टविनायक मित्र मंडळ' },
  { path: '**', redirectTo: '' }
];


