import React , { useState }from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import BorderAnimated from '../components/BorderAnimated'
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email:"",
    password:""
  })

 const {signUp , isSigningUp} = useAuthStore()

 const handleChange = (e)=>{
  let val = e.target.value
  setFormData(pre=>({...pre,[e.target.name]:val}))

 }

 const handleSubmit = (e)=>{
  e.preventDefault()
  signUp(formData)
 }
 
  return (
     <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
       <BorderAnimated>
        <div className='w-full flex flex-col md:flex-row '>
          {/* form colum -left side */}
          <div className='md:w-1/2 p-10 flex item-center justify-center md:border-r border-slate-600/30 '>
           <div className='w-full max-w-md mt-10  '>

            {/* heading tag */}
            <div className='text-center mb-8'>
              <MessageCircleIcon className='w-12 h-12 mx-auto text-slate-400 mb-4 mt-4 '/>
              <h2 className='text-2xl font-bold text-slate-200 mb-2'>Create Account </h2>
              <p className='text-slate-400'>Sign up for new account</p>
            </div>

             {/* form */}
             <form onSubmit={handleSubmit} className='space-y-6'>

              {/* {Username} */}
              <div>
                <label className='auth-input-label'>Username</label>
                <div className='relative'>
                  <UserIcon className='auth-input-icon'></UserIcon>
                  <input type="text" name = "username" onChange={handleChange} className='input' placeholder='John Doe' />
                </div>
              </div>

              {/* {email} */}
              <div>
                <label className='auth-input-label'>Email</label>
                <div className='relative'>
                  <MailIcon className='auth-input-icon'></MailIcon>
                  <input type="email" name = "email" onChange={handleChange} className='input' placeholder='Johndoe@gmail.com' />
                </div>
              </div>

              {/* {password} */}
              <div>
                <label className='auth-input-label'>Password</label>
                <div className='relative'>
                  <LockIcon className='auth-input-icon'></LockIcon>
                  <input type="password" name = "password" onChange={handleChange} className='input' placeholder='Enter your Password'  />
                </div>
              </div>

                {/* submit button */}
                <button className='auth-btn' type='submit' disabled={isSigningUp}>
                  {isSigningUp?(
                      <LoaderIcon className='w-full h-5 animate-spin text-center'></LoaderIcon>
                  ) :("Create Account") }
                </button>

             </form>

             {/* redirect link */}
             <div className='mt-6 text-center'>
              <Link to="/login" className='auth-link'>Already have an account ? Login</Link>

             </div>

           </div>
          </div>

          {/* {right side of form} */}
          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                  <div>
                <img
                  src="/signup.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Start Your Journey Today</h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
       </BorderAnimated>
      </div>

  
     </div>
  )
}

export default SignUpPage
