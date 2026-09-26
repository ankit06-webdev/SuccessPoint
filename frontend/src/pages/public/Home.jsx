import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, MapPin, Phone, Clock, BarChart, GraduationCap, Users } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* Hero Section */}
      <section className="relative w-full h-[650px] flex items-center justify-center text-center text-white bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
        />
        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="px-5 py-1.5 text-xs font-bold tracking-widest text-[#4229b8] border border-[#4229b8]/30 rounded-full mb-6 bg-white/90 backdrop-blur-sm uppercase shadow-sm">
            EMPOWERING YOUR FUTURE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-4xl leading-[1.1] tracking-tight">
            Achieve Your Dreams with Success Point
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200 font-medium leading-relaxed">
            Premier coaching and comprehensive skill development programs designed to accelerate your career. Join thousands of successful alumni who started their journey here.
          </p>
          <Link to="/login">
            <Button className="mt-10 rounded-full px-8 py-6 text-sm font-bold tracking-widest bg-[#4229b8] hover:bg-[#341e96] shadow-lg shadow-[#4229b8]/30">
              GET STARTED <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Card Overlapping Hero */}
      <div className="max-w-5xl mx-auto px-4 relative z-20 -mt-16">
        <Card className="shadow-2xl shadow-slate-200/50 border-0 rounded-[24px] bg-white">
          <CardContent className="flex flex-col md:flex-row justify-around items-center p-10 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-4 w-full">
              <div className="h-14 w-14 bg-[#edeaff] rounded-2xl mx-auto mb-5 flex items-center justify-center text-[#4229b8]">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900">5000+</h3>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 mt-2 uppercase">Students Taught</p>
            </div>
            <div className="p-4 w-full">
              <div className="h-14 w-14 bg-[#ffefe5] rounded-2xl mx-auto mb-5 flex items-center justify-center text-[#f97316]">
                <BarChart className="h-7 w-7" />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900">98 %</h3>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 mt-2 uppercase">Success Rate</p>
            </div>
            <div className="p-4 w-full">
              <div className="h-14 w-14 bg-[#f1f5f9] rounded-2xl mx-auto mb-5 flex items-center justify-center text-slate-600">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900">50+</h3>
              <p className="text-[11px] font-bold tracking-widest text-slate-400 mt-2 uppercase">Expert Faculty</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Courses Section */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex justify-between items-end mb-14">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#4229b8] uppercase mb-3 block">CURRICULUM</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Courses</h2>
            <p className="text-slate-500 mt-2 font-medium">Master in-demand skills with our industry-aligned bootcamps and essential programs.</p>
          </div>
          <Link to="/courses" className="hidden sm:flex items-center text-[11px] font-bold text-[#4229b8] tracking-widest uppercase hover:opacity-80">
            EXPLORE ALL <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Course 1 */}
          <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[20px] overflow-hidden bg-white group">
            <div className="relative h-52 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Web Dev" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                BESTSELLER
              </div>
            </div>
            <CardContent className="p-7">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">TECHNOLOGY</span>
              <h3 className="text-xl font-extrabold mt-2 mb-3 text-slate-900">Web Development Bootcamp</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">Comprehensive full-stack training covering frontend frameworks, backend APIs, and modern databases.</p>
              
              <div className="flex items-center gap-5 text-[11px] font-bold tracking-wider text-slate-400 mb-7 uppercase">
                <span className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" /> 4 MONTHS</span>
                <span className="flex items-center"><BarChart className="mr-1.5 h-3.5 w-3.5" /> BEGINNER</span>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <span className="text-2xl font-black text-slate-900">₹5,999</span>
                <Button variant="secondary" className="bg-[#edeaff] text-[#4229b8] hover:bg-[#dcd6fa] text-xs font-bold tracking-wide rounded-full px-5">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course 2 */}
          <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[20px] overflow-hidden bg-white group">
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Data Science" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
            </div>
            <CardContent className="p-7">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">DATA & ANALYTICS</span>
              <h3 className="text-xl font-extrabold mt-2 mb-3 text-slate-900">Data Science Essentials</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">Learn Python, data manipulation, statistical analysis, and basic machine learning techniques.</p>
              
              <div className="flex items-center gap-5 text-[11px] font-bold tracking-wider text-slate-400 mb-7 uppercase">
                <span className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" /> 3 MONTHS</span>
                <span className="flex items-center"><BarChart className="mr-1.5 h-3.5 w-3.5" /> INTERMEDIATE</span>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <span className="text-2xl font-black text-slate-900">₹4,999</span>
                <Button variant="secondary" className="bg-[#edeaff] text-[#4229b8] hover:bg-[#dcd6fa] text-xs font-bold tracking-wide rounded-full px-5">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course 3 */}
          <Card className="border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[20px] overflow-hidden bg-white group">
            <div className="relative h-52 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mobile Dev" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <CardContent className="p-7">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">ENGINEERING</span>
              <h3 className="text-xl font-extrabold mt-2 mb-3 text-slate-900">Mobile App Development</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-2">Build cross-platform applications using modern frameworks like React Native and Flutter.</p>
              
              <div className="flex items-center gap-5 text-[11px] font-bold tracking-wider text-slate-400 mb-7 uppercase">
                <span className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" /> 4 MONTHS</span>
                <span className="flex items-center"><BarChart className="mr-1.5 h-3.5 w-3.5" /> BEGINNER</span>
              </div>
              
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <span className="text-2xl font-black text-slate-900">₹5,499</span>
                <Button variant="secondary" className="bg-[#edeaff] text-[#4229b8] hover:bg-[#dcd6fa] text-xs font-bold tracking-wide rounded-full px-5">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white pb-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[550px] rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Students studying" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-10">
              <p className="text-2xl font-bold text-white italic leading-snug">
                "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
              </p>
            </div>
          </div>
          
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#4229b8] uppercase mb-3 block">OUR MISSION</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.15]">Empowering students with knowledge and actionable skills.</h2>
            <p className="text-slate-600 text-[17px] mb-8 leading-relaxed">
              At Success Point, we believe in a holistic approach to education. Since 2010, our focus has been on providing academic rigor combined with practical, real-world skills. We don't just teach; we mentor, guide, and prepare you for the challenges of tomorrow's professional landscape.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-[#4229b8] shrink-0 mr-4" />
                <span className="text-slate-700 font-medium">Industry-vetted curriculum updated annually</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-[#4229b8] shrink-0 mr-4" />
                <span className="text-slate-700 font-medium">Personalized mentorship and career counseling</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-[#4229b8] shrink-0 mr-4" />
                <span className="text-slate-700 font-medium">State-of-the-art learning infrastructure</span>
              </li>
            </ul>
            <Link to="/about" className="inline-flex items-center text-[11px] font-bold text-[#4229b8] tracking-widest uppercase hover:opacity-80">
              LEARN MORE ABOUT US <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Location Section */}
      <section className="bg-[#f7f5ff] py-28 border-t border-[#edeaff]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#4229b8] uppercase mb-3 block">GET IN TOUCH</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">Visit Our Campus</h2>
            <p className="text-slate-600 mb-10 text-[17px] leading-relaxed">Drop by our Jamshedpur campus for a consultation or reach out to our admissions team directly.</p>
            
            <div className="space-y-5">
              <Card className="border-0 shadow-sm shadow-[#4229b8]/5 rounded-[20px] bg-white flex items-center p-6 transition-transform hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-[#edeaff] flex items-center justify-center text-[#4229b8] shrink-0 mr-6">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase mb-1.5">JAMSHEDPUR CAMPUS</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    124 Academic Circle, Sakchi<br />
                    Jamshedpur, Jharkhand 831001
                  </p>
                </div>
              </Card>
              
              <Card className="border-0 shadow-sm shadow-[#4229b8]/5 rounded-[20px] bg-white flex items-center p-6 transition-transform hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-[#edeaff] flex items-center justify-center text-[#4229b8] shrink-0 mr-6">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase mb-1.5">CONTACT ADMISSIONS</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    +91 857 243 0000<br />
                    admissions@successpoint.edu
                  </p>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="relative h-[500px] rounded-[32px] overflow-hidden shadow-xl shadow-[#4229b8]/10 border-[6px] border-white">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Map Location" className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-6 right-6 bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/10 text-center">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SUCCESS POINT H.Q.</p>
               <a href="#" className="text-[11px] font-bold text-[#4229b8] uppercase tracking-wide hover:underline">View on Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 font-bold text-xl text-slate-900 tracking-tight mb-6">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
              Success Point
            </div>
            <p className="text-slate-500 text-[13px] leading-relaxed mb-6 pr-4">
              Empowering students through academic rigor and professional guidance since 2010.
            </p>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold tracking-widest text-[#4229b8] uppercase mb-6">SITE MAP</h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-500">
              <li><Link to="/admissions" className="hover:text-[#4229b8] transition-colors">Admissions</Link></li>
              <li><Link to="/examinations" className="hover:text-[#4229b8] transition-colors">Examination</Link></li>
              <li><Link to="/resources" className="hover:text-[#4229b8] transition-colors">Resources</Link></li>
              <li><Link to="/careers" className="hover:text-[#4229b8] transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[11px] font-bold tracking-widest text-[#4229b8] uppercase mb-6">PROGRAMS</h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-500">
              <li><Link to="#" className="hover:text-[#4229b8] transition-colors">Science Stream</Link></li>
              <li><Link to="#" className="hover:text-[#4229b8] transition-colors">Commerce Stream</Link></li>
              <li><Link to="#" className="hover:text-[#4229b8] transition-colors">Entrance Coaching</Link></li>
              <li><Link to="#" className="hover:text-[#4229b8] transition-colors">Distance Learning</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-widest text-[#4229b8] uppercase mb-6">JAMSHEDPUR CAMPUS</h4>
            <p className="text-slate-500 text-[13px] leading-relaxed mb-4 font-medium">
              124 Academic Circle, Sakchi<br />
              Jamshedpur, Jharkhand 831001
            </p>
            <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
              +91 857 243 0000<br />
              info@successpoint.edu
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SUCCESS POINT EDUCATIONAL TRUST. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link to="#" className="hover:text-[#4229b8] transition-colors">PRIVACY POLICY</Link>
            <Link to="#" className="hover:text-[#4229b8] transition-colors">TERMS OF SERVICE</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}