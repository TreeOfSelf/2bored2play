/*
  ___  _  _  __    __    __  __ _   ___ 
 / __)/ )( \(  )  (  )  (  )(  ( \ / __)
( (__ ) \/ (/ (_/\/ (_/\ )( /    /( (_ \
 \___)\____/\____/\____/(__)\_)__) \___/																							
Seperate culling process that gets created as a worker. Goes through nearby chunks and returns culled chunk data. 
*/
//glMatrix for vector math
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t=t||self).glMatrix={})}(this,function(t){"use strict";var n=1e-6,a="undefined"!=typeof Float32Array?Float32Array:Array,r=Math.random;var u=Math.PI/180;Math.hypot||(Math.hypot=function(){for(var t=0,n=arguments.length;n--;)t+=arguments[n]*arguments[n];return Math.sqrt(t)});var e=Object.freeze({EPSILON:n,get ARRAY_TYPE(){return a},RANDOM:r,setMatrixArrayType:function(t){a=t},toRadian:function(t){return t*u},equals:function(t,a){return Math.abs(t-a)<=n*Math.max(1,Math.abs(t),Math.abs(a))}});function o(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=a[0],c=a[1],h=a[2],s=a[3];return t[0]=r*i+e*c,t[1]=u*i+o*c,t[2]=r*h+e*s,t[3]=u*h+o*s,t}function i(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t[2]=n[2]-a[2],t[3]=n[3]-a[3],t}var c=o,h=i,s=Object.freeze({create:function(){var t=new a(4);return a!=Float32Array&&(t[1]=0,t[2]=0),t[0]=1,t[3]=1,t},clone:function(t){var n=new a(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},copy:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},fromValues:function(t,n,r,u){var e=new a(4);return e[0]=t,e[1]=n,e[2]=r,e[3]=u,e},set:function(t,n,a,r,u){return t[0]=n,t[1]=a,t[2]=r,t[3]=u,t},transpose:function(t,n){if(t===n){var a=n[1];t[1]=n[2],t[2]=a}else t[0]=n[0],t[1]=n[2],t[2]=n[1],t[3]=n[3];return t},invert:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=a*e-u*r;return o?(o=1/o,t[0]=e*o,t[1]=-r*o,t[2]=-u*o,t[3]=a*o,t):null},adjoint:function(t,n){var a=n[0];return t[0]=n[3],t[1]=-n[1],t[2]=-n[2],t[3]=a,t},determinant:function(t){return t[0]*t[3]-t[2]*t[1]},multiply:o,rotate:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=Math.sin(a),c=Math.cos(a);return t[0]=r*c+e*i,t[1]=u*c+o*i,t[2]=r*-i+e*c,t[3]=u*-i+o*c,t},scale:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=a[0],c=a[1];return t[0]=r*i,t[1]=u*i,t[2]=e*c,t[3]=o*c,t},fromRotation:function(t,n){var a=Math.sin(n),r=Math.cos(n);return t[0]=r,t[1]=a,t[2]=-a,t[3]=r,t},fromScaling:function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t},str:function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},frob:function(t){return Math.hypot(t[0],t[1],t[2],t[3])},LDU:function(t,n,a,r){return t[2]=r[2]/r[0],a[0]=r[0],a[1]=r[1],a[3]=r[3]-t[2]*a[1],[t,n,a]},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t[3]=n[3]+a[3],t},subtract:i,exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]},equals:function(t,a){var r=t[0],u=t[1],e=t[2],o=t[3],i=a[0],c=a[1],h=a[2],s=a[3];return Math.abs(r-i)<=n*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(u-c)<=n*Math.max(1,Math.abs(u),Math.abs(c))&&Math.abs(e-h)<=n*Math.max(1,Math.abs(e),Math.abs(h))&&Math.abs(o-s)<=n*Math.max(1,Math.abs(o),Math.abs(s))},multiplyScalar:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t},multiplyScalarAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t[2]=n[2]+a[2]*r,t[3]=n[3]+a[3]*r,t},mul:c,sub:h});function M(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=a[0],s=a[1],M=a[2],f=a[3],l=a[4],v=a[5];return t[0]=r*h+e*s,t[1]=u*h+o*s,t[2]=r*M+e*f,t[3]=u*M+o*f,t[4]=r*l+e*v+i,t[5]=u*l+o*v+c,t}function f(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t[2]=n[2]-a[2],t[3]=n[3]-a[3],t[4]=n[4]-a[4],t[5]=n[5]-a[5],t}var l=M,v=f,b=Object.freeze({create:function(){var t=new a(6);return a!=Float32Array&&(t[1]=0,t[2]=0,t[4]=0,t[5]=0),t[0]=1,t[3]=1,t},clone:function(t){var n=new a(6);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n},copy:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},fromValues:function(t,n,r,u,e,o){var i=new a(6);return i[0]=t,i[1]=n,i[2]=r,i[3]=u,i[4]=e,i[5]=o,i},set:function(t,n,a,r,u,e,o){return t[0]=n,t[1]=a,t[2]=r,t[3]=u,t[4]=e,t[5]=o,t},invert:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=n[4],i=n[5],c=a*e-r*u;return c?(c=1/c,t[0]=e*c,t[1]=-r*c,t[2]=-u*c,t[3]=a*c,t[4]=(u*i-e*o)*c,t[5]=(r*o-a*i)*c,t):null},determinant:function(t){return t[0]*t[3]-t[1]*t[2]},multiply:M,rotate:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=Math.sin(a),s=Math.cos(a);return t[0]=r*s+e*h,t[1]=u*s+o*h,t[2]=r*-h+e*s,t[3]=u*-h+o*s,t[4]=i,t[5]=c,t},scale:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=a[0],s=a[1];return t[0]=r*h,t[1]=u*h,t[2]=e*s,t[3]=o*s,t[4]=i,t[5]=c,t},translate:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=a[0],s=a[1];return t[0]=r,t[1]=u,t[2]=e,t[3]=o,t[4]=r*h+e*s+i,t[5]=u*h+o*s+c,t},fromRotation:function(t,n){var a=Math.sin(n),r=Math.cos(n);return t[0]=r,t[1]=a,t[2]=-a,t[3]=r,t[4]=0,t[5]=0,t},fromScaling:function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t[4]=0,t[5]=0,t},fromTranslation:function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=n[0],t[5]=n[1],t},str:function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},frob:function(t){return Math.hypot(t[0],t[1],t[2],t[3],t[4],t[5],1)},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t[3]=n[3]+a[3],t[4]=n[4]+a[4],t[5]=n[5]+a[5],t},subtract:f,multiplyScalar:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*a,t[5]=n[5]*a,t},multiplyScalarAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t[2]=n[2]+a[2]*r,t[3]=n[3]+a[3]*r,t[4]=n[4]+a[4]*r,t[5]=n[5]+a[5]*r,t},exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]},equals:function(t,a){var r=t[0],u=t[1],e=t[2],o=t[3],i=t[4],c=t[5],h=a[0],s=a[1],M=a[2],f=a[3],l=a[4],v=a[5];return Math.abs(r-h)<=n*Math.max(1,Math.abs(r),Math.abs(h))&&Math.abs(u-s)<=n*Math.max(1,Math.abs(u),Math.abs(s))&&Math.abs(e-M)<=n*Math.max(1,Math.abs(e),Math.abs(M))&&Math.abs(o-f)<=n*Math.max(1,Math.abs(o),Math.abs(f))&&Math.abs(i-l)<=n*Math.max(1,Math.abs(i),Math.abs(l))&&Math.abs(c-v)<=n*Math.max(1,Math.abs(c),Math.abs(v))},mul:l,sub:v});function m(){var t=new a(9);return a!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function d(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=n[8],f=a[0],l=a[1],v=a[2],b=a[3],m=a[4],d=a[5],x=a[6],p=a[7],y=a[8];return t[0]=f*r+l*o+v*h,t[1]=f*u+l*i+v*s,t[2]=f*e+l*c+v*M,t[3]=b*r+m*o+d*h,t[4]=b*u+m*i+d*s,t[5]=b*e+m*c+d*M,t[6]=x*r+p*o+y*h,t[7]=x*u+p*i+y*s,t[8]=x*e+p*c+y*M,t}function x(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t[2]=n[2]-a[2],t[3]=n[3]-a[3],t[4]=n[4]-a[4],t[5]=n[5]-a[5],t[6]=n[6]-a[6],t[7]=n[7]-a[7],t[8]=n[8]-a[8],t}var p=d,y=x,q=Object.freeze({create:m,fromMat4:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[4],t[4]=n[5],t[5]=n[6],t[6]=n[8],t[7]=n[9],t[8]=n[10],t},clone:function(t){var n=new a(9);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n},copy:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},fromValues:function(t,n,r,u,e,o,i,c,h){var s=new a(9);return s[0]=t,s[1]=n,s[2]=r,s[3]=u,s[4]=e,s[5]=o,s[6]=i,s[7]=c,s[8]=h,s},set:function(t,n,a,r,u,e,o,i,c,h){return t[0]=n,t[1]=a,t[2]=r,t[3]=u,t[4]=e,t[5]=o,t[6]=i,t[7]=c,t[8]=h,t},identity:function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},transpose:function(t,n){if(t===n){var a=n[1],r=n[2],u=n[5];t[1]=n[3],t[2]=n[6],t[3]=a,t[5]=n[7],t[6]=r,t[7]=u}else t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8];return t},invert:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=n[4],i=n[5],c=n[6],h=n[7],s=n[8],M=s*o-i*h,f=-s*e+i*c,l=h*e-o*c,v=a*M+r*f+u*l;return v?(v=1/v,t[0]=M*v,t[1]=(-s*r+u*h)*v,t[2]=(i*r-u*o)*v,t[3]=f*v,t[4]=(s*a-u*c)*v,t[5]=(-i*a+u*e)*v,t[6]=l*v,t[7]=(-h*a+r*c)*v,t[8]=(o*a-r*e)*v,t):null},adjoint:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=n[4],i=n[5],c=n[6],h=n[7],s=n[8];return t[0]=o*s-i*h,t[1]=u*h-r*s,t[2]=r*i-u*o,t[3]=i*c-e*s,t[4]=a*s-u*c,t[5]=u*e-a*i,t[6]=e*h-o*c,t[7]=r*c-a*h,t[8]=a*o-r*e,t},determinant:function(t){var n=t[0],a=t[1],r=t[2],u=t[3],e=t[4],o=t[5],i=t[6],c=t[7],h=t[8];return n*(h*e-o*c)+a*(-h*u+o*i)+r*(c*u-e*i)},multiply:d,translate:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=n[8],f=a[0],l=a[1];return t[0]=r,t[1]=u,t[2]=e,t[3]=o,t[4]=i,t[5]=c,t[6]=f*r+l*o+h,t[7]=f*u+l*i+s,t[8]=f*e+l*c+M,t},rotate:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=n[8],f=Math.sin(a),l=Math.cos(a);return t[0]=l*r+f*o,t[1]=l*u+f*i,t[2]=l*e+f*c,t[3]=l*o-f*r,t[4]=l*i-f*u,t[5]=l*c-f*e,t[6]=h,t[7]=s,t[8]=M,t},scale:function(t,n,a){var r=a[0],u=a[1];return t[0]=r*n[0],t[1]=r*n[1],t[2]=r*n[2],t[3]=u*n[3],t[4]=u*n[4],t[5]=u*n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},fromTranslation:function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=n[0],t[7]=n[1],t[8]=1,t},fromRotation:function(t,n){var a=Math.sin(n),r=Math.cos(n);return t[0]=r,t[1]=a,t[2]=0,t[3]=-a,t[4]=r,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},fromScaling:function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=n[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},fromMat2d:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=0,t[3]=n[2],t[4]=n[3],t[5]=0,t[6]=n[4],t[7]=n[5],t[8]=1,t},fromQuat:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=a+a,i=r+r,c=u+u,h=a*o,s=r*o,M=r*i,f=u*o,l=u*i,v=u*c,b=e*o,m=e*i,d=e*c;return t[0]=1-M-v,t[3]=s-d,t[6]=f+m,t[1]=s+d,t[4]=1-h-v,t[7]=l-b,t[2]=f-m,t[5]=l+b,t[8]=1-h-M,t},normalFromMat4:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=n[4],i=n[5],c=n[6],h=n[7],s=n[8],M=n[9],f=n[10],l=n[11],v=n[12],b=n[13],m=n[14],d=n[15],x=a*i-r*o,p=a*c-u*o,y=a*h-e*o,q=r*c-u*i,g=r*h-e*i,A=u*h-e*c,w=s*b-M*v,R=s*m-f*v,z=s*d-l*v,P=M*m-f*b,j=M*d-l*b,I=f*d-l*m,S=x*I-p*j+y*P+q*z-g*R+A*w;return S?(S=1/S,t[0]=(i*I-c*j+h*P)*S,t[1]=(c*z-o*I-h*R)*S,t[2]=(o*j-i*z+h*w)*S,t[3]=(u*j-r*I-e*P)*S,t[4]=(a*I-u*z+e*R)*S,t[5]=(r*z-a*j-e*w)*S,t[6]=(b*A-m*g+d*q)*S,t[7]=(m*y-v*A-d*p)*S,t[8]=(v*g-b*y+d*x)*S,t):null},projection:function(t,n,a){return t[0]=2/n,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/a,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t},str:function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},frob:function(t){return Math.hypot(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8])},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t[3]=n[3]+a[3],t[4]=n[4]+a[4],t[5]=n[5]+a[5],t[6]=n[6]+a[6],t[7]=n[7]+a[7],t[8]=n[8]+a[8],t},subtract:x,multiplyScalar:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=n[7]*a,t[8]=n[8]*a,t},multiplyScalarAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t[2]=n[2]+a[2]*r,t[3]=n[3]+a[3]*r,t[4]=n[4]+a[4]*r,t[5]=n[5]+a[5]*r,t[6]=n[6]+a[6]*r,t[7]=n[7]+a[7]*r,t[8]=n[8]+a[8]*r,t},exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]&&t[8]===n[8]},equals:function(t,a){var r=t[0],u=t[1],e=t[2],o=t[3],i=t[4],c=t[5],h=t[6],s=t[7],M=t[8],f=a[0],l=a[1],v=a[2],b=a[3],m=a[4],d=a[5],x=a[6],p=a[7],y=a[8];return Math.abs(r-f)<=n*Math.max(1,Math.abs(r),Math.abs(f))&&Math.abs(u-l)<=n*Math.max(1,Math.abs(u),Math.abs(l))&&Math.abs(e-v)<=n*Math.max(1,Math.abs(e),Math.abs(v))&&Math.abs(o-b)<=n*Math.max(1,Math.abs(o),Math.abs(b))&&Math.abs(i-m)<=n*Math.max(1,Math.abs(i),Math.abs(m))&&Math.abs(c-d)<=n*Math.max(1,Math.abs(c),Math.abs(d))&&Math.abs(h-x)<=n*Math.max(1,Math.abs(h),Math.abs(x))&&Math.abs(s-p)<=n*Math.max(1,Math.abs(s),Math.abs(p))&&Math.abs(M-y)<=n*Math.max(1,Math.abs(M),Math.abs(y))},mul:p,sub:y});function g(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function A(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=n[8],f=n[9],l=n[10],v=n[11],b=n[12],m=n[13],d=n[14],x=n[15],p=a[0],y=a[1],q=a[2],g=a[3];return t[0]=p*r+y*i+q*M+g*b,t[1]=p*u+y*c+q*f+g*m,t[2]=p*e+y*h+q*l+g*d,t[3]=p*o+y*s+q*v+g*x,p=a[4],y=a[5],q=a[6],g=a[7],t[4]=p*r+y*i+q*M+g*b,t[5]=p*u+y*c+q*f+g*m,t[6]=p*e+y*h+q*l+g*d,t[7]=p*o+y*s+q*v+g*x,p=a[8],y=a[9],q=a[10],g=a[11],t[8]=p*r+y*i+q*M+g*b,t[9]=p*u+y*c+q*f+g*m,t[10]=p*e+y*h+q*l+g*d,t[11]=p*o+y*s+q*v+g*x,p=a[12],y=a[13],q=a[14],g=a[15],t[12]=p*r+y*i+q*M+g*b,t[13]=p*u+y*c+q*f+g*m,t[14]=p*e+y*h+q*l+g*d,t[15]=p*o+y*s+q*v+g*x,t}function w(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=r+r,c=u+u,h=e+e,s=r*i,M=r*c,f=r*h,l=u*c,v=u*h,b=e*h,m=o*i,d=o*c,x=o*h;return t[0]=1-(l+b),t[1]=M+x,t[2]=f-d,t[3]=0,t[4]=M-x,t[5]=1-(s+b),t[6]=v+m,t[7]=0,t[8]=f+d,t[9]=v-m,t[10]=1-(s+l),t[11]=0,t[12]=a[0],t[13]=a[1],t[14]=a[2],t[15]=1,t}function R(t,n){return t[0]=n[12],t[1]=n[13],t[2]=n[14],t}function z(t,n){var a=n[0],r=n[1],u=n[2],e=n[4],o=n[5],i=n[6],c=n[8],h=n[9],s=n[10];return t[0]=Math.hypot(a,r,u),t[1]=Math.hypot(e,o,i),t[2]=Math.hypot(c,h,s),t}function P(t,n){var r=new a(3);z(r,n);var u=1/r[0],e=1/r[1],o=1/r[2],i=n[0]*u,c=n[1]*e,h=n[2]*o,s=n[4]*u,M=n[5]*e,f=n[6]*o,l=n[8]*u,v=n[9]*e,b=n[10]*o,m=i+M+b,d=0;return m>0?(d=2*Math.sqrt(m+1),t[3]=.25*d,t[0]=(f-v)/d,t[1]=(l-h)/d,t[2]=(c-s)/d):i>M&&i>b?(d=2*Math.sqrt(1+i-M-b),t[3]=(f-v)/d,t[0]=.25*d,t[1]=(c+s)/d,t[2]=(l+h)/d):M>b?(d=2*Math.sqrt(1+M-i-b),t[3]=(l-h)/d,t[0]=(c+s)/d,t[1]=.25*d,t[2]=(f+v)/d):(d=2*Math.sqrt(1+b-i-M),t[3]=(c-s)/d,t[0]=(l+h)/d,t[1]=(f+v)/d,t[2]=.25*d),t}function j(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t[2]=n[2]-a[2],t[3]=n[3]-a[3],t[4]=n[4]-a[4],t[5]=n[5]-a[5],t[6]=n[6]-a[6],t[7]=n[7]-a[7],t[8]=n[8]-a[8],t[9]=n[9]-a[9],t[10]=n[10]-a[10],t[11]=n[11]-a[11],t[12]=n[12]-a[12],t[13]=n[13]-a[13],t[14]=n[14]-a[14],t[15]=n[15]-a[15],t}var I=A,S=j,E=Object.freeze({create:function(){var t=new a(16);return a!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t},clone:function(t){var n=new a(16);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n},copy:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},fromValues:function(t,n,r,u,e,o,i,c,h,s,M,f,l,v,b,m){var d=new a(16);return d[0]=t,d[1]=n,d[2]=r,d[3]=u,d[4]=e,d[5]=o,d[6]=i,d[7]=c,d[8]=h,d[9]=s,d[10]=M,d[11]=f,d[12]=l,d[13]=v,d[14]=b,d[15]=m,d},set:function(t,n,a,r,u,e,o,i,c,h,s,M,f,l,v,b,m){return t[0]=n,t[1]=a,t[2]=r,t[3]=u,t[4]=e,t[5]=o,t[6]=i,t[7]=c,t[8]=h,t[9]=s,t[10]=M,t[11]=f,t[12]=l,t[13]=v,t[14]=b,t[15]=m,t},identity:g,transpose:function(t,n){if(t===n){var a=n[1],r=n[2],u=n[3],e=n[6],o=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=a,t[6]=n[9],t[7]=n[13],t[8]=r,t[9]=e,t[11]=n[14],t[12]=u,t[13]=o,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t},invert:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=n[4],i=n[5],c=n[6],h=n[7],s=n[8],M=n[9],f=n[10],l=n[11],v=n[12],b=n[13],m=n[14],d=n[15],x=a*i-r*o,p=a*c-u*o,y=a*h-e*o,q=r*c-u*i,g=r*h-e*i,A=u*h-e*c,w=s*b-M*v,R=s*m-f*v,z=s*d-l*v,P=M*m-f*b,j=M*d-l*b,I=f*d-l*m,S=x*I-p*j+y*P+q*z-g*R+A*w;return S?(S=1/S,t[0]=(i*I-c*j+h*P)*S,t[1]=(u*j-r*I-e*P)*S,t[2]=(b*A-m*g+d*q)*S,t[3]=(f*g-M*A-l*q)*S,t[4]=(c*z-o*I-h*R)*S,t[5]=(a*I-u*z+e*R)*S,t[6]=(m*y-v*A-d*p)*S,t[7]=(s*A-f*y+l*p)*S,t[8]=(o*j-i*z+h*w)*S,t[9]=(r*z-a*j-e*w)*S,t[10]=(v*g-b*y+d*x)*S,t[11]=(M*y-s*g-l*x)*S,t[12]=(i*R-o*P-c*w)*S,t[13]=(a*P-r*R+u*w)*S,t[14]=(b*p-v*q-m*x)*S,t[15]=(s*q-M*p+f*x)*S,t):null},adjoint:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=n[4],i=n[5],c=n[6],h=n[7],s=n[8],M=n[9],f=n[10],l=n[11],v=n[12],b=n[13],m=n[14],d=n[15];return t[0]=i*(f*d-l*m)-M*(c*d-h*m)+b*(c*l-h*f),t[1]=-(r*(f*d-l*m)-M*(u*d-e*m)+b*(u*l-e*f)),t[2]=r*(c*d-h*m)-i*(u*d-e*m)+b*(u*h-e*c),t[3]=-(r*(c*l-h*f)-i*(u*l-e*f)+M*(u*h-e*c)),t[4]=-(o*(f*d-l*m)-s*(c*d-h*m)+v*(c*l-h*f)),t[5]=a*(f*d-l*m)-s*(u*d-e*m)+v*(u*l-e*f),t[6]=-(a*(c*d-h*m)-o*(u*d-e*m)+v*(u*h-e*c)),t[7]=a*(c*l-h*f)-o*(u*l-e*f)+s*(u*h-e*c),t[8]=o*(M*d-l*b)-s*(i*d-h*b)+v*(i*l-h*M),t[9]=-(a*(M*d-l*b)-s*(r*d-e*b)+v*(r*l-e*M)),t[10]=a*(i*d-h*b)-o*(r*d-e*b)+v*(r*h-e*i),t[11]=-(a*(i*l-h*M)-o*(r*l-e*M)+s*(r*h-e*i)),t[12]=-(o*(M*m-f*b)-s*(i*m-c*b)+v*(i*f-c*M)),t[13]=a*(M*m-f*b)-s*(r*m-u*b)+v*(r*f-u*M),t[14]=-(a*(i*m-c*b)-o*(r*m-u*b)+v*(r*c-u*i)),t[15]=a*(i*f-c*M)-o*(r*f-u*M)+s*(r*c-u*i),t},determinant:function(t){var n=t[0],a=t[1],r=t[2],u=t[3],e=t[4],o=t[5],i=t[6],c=t[7],h=t[8],s=t[9],M=t[10],f=t[11],l=t[12],v=t[13],b=t[14],m=t[15];return(n*o-a*e)*(M*m-f*b)-(n*i-r*e)*(s*m-f*v)+(n*c-u*e)*(s*b-M*v)+(a*i-r*o)*(h*m-f*l)-(a*c-u*o)*(h*b-M*l)+(r*c-u*i)*(h*v-s*l)},multiply:A,translate:function(t,n,a){var r,u,e,o,i,c,h,s,M,f,l,v,b=a[0],m=a[1],d=a[2];return n===t?(t[12]=n[0]*b+n[4]*m+n[8]*d+n[12],t[13]=n[1]*b+n[5]*m+n[9]*d+n[13],t[14]=n[2]*b+n[6]*m+n[10]*d+n[14],t[15]=n[3]*b+n[7]*m+n[11]*d+n[15]):(r=n[0],u=n[1],e=n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=n[8],f=n[9],l=n[10],v=n[11],t[0]=r,t[1]=u,t[2]=e,t[3]=o,t[4]=i,t[5]=c,t[6]=h,t[7]=s,t[8]=M,t[9]=f,t[10]=l,t[11]=v,t[12]=r*b+i*m+M*d+n[12],t[13]=u*b+c*m+f*d+n[13],t[14]=e*b+h*m+l*d+n[14],t[15]=o*b+s*m+v*d+n[15]),t},scale:function(t,n,a){var r=a[0],u=a[1],e=a[2];return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*u,t[5]=n[5]*u,t[6]=n[6]*u,t[7]=n[7]*u,t[8]=n[8]*e,t[9]=n[9]*e,t[10]=n[10]*e,t[11]=n[11]*e,t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},rotate:function(t,a,r,u){var e,o,i,c,h,s,M,f,l,v,b,m,d,x,p,y,q,g,A,w,R,z,P,j,I=u[0],S=u[1],E=u[2],O=Math.hypot(I,S,E);return O<n?null:(I*=O=1/O,S*=O,E*=O,e=Math.sin(r),i=1-(o=Math.cos(r)),c=a[0],h=a[1],s=a[2],M=a[3],f=a[4],l=a[5],v=a[6],b=a[7],m=a[8],d=a[9],x=a[10],p=a[11],y=I*I*i+o,q=S*I*i+E*e,g=E*I*i-S*e,A=I*S*i-E*e,w=S*S*i+o,R=E*S*i+I*e,z=I*E*i+S*e,P=S*E*i-I*e,j=E*E*i+o,t[0]=c*y+f*q+m*g,t[1]=h*y+l*q+d*g,t[2]=s*y+v*q+x*g,t[3]=M*y+b*q+p*g,t[4]=c*A+f*w+m*R,t[5]=h*A+l*w+d*R,t[6]=s*A+v*w+x*R,t[7]=M*A+b*w+p*R,t[8]=c*z+f*P+m*j,t[9]=h*z+l*P+d*j,t[10]=s*z+v*P+x*j,t[11]=M*z+b*P+p*j,a!==t&&(t[12]=a[12],t[13]=a[13],t[14]=a[14],t[15]=a[15]),t)},rotateX:function(t,n,a){var r=Math.sin(a),u=Math.cos(a),e=n[4],o=n[5],i=n[6],c=n[7],h=n[8],s=n[9],M=n[10],f=n[11];return n!==t&&(t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[4]=e*u+h*r,t[5]=o*u+s*r,t[6]=i*u+M*r,t[7]=c*u+f*r,t[8]=h*u-e*r,t[9]=s*u-o*r,t[10]=M*u-i*r,t[11]=f*u-c*r,t},rotateY:function(t,n,a){var r=Math.sin(a),u=Math.cos(a),e=n[0],o=n[1],i=n[2],c=n[3],h=n[8],s=n[9],M=n[10],f=n[11];return n!==t&&(t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=e*u-h*r,t[1]=o*u-s*r,t[2]=i*u-M*r,t[3]=c*u-f*r,t[8]=e*r+h*u,t[9]=o*r+s*u,t[10]=i*r+M*u,t[11]=c*r+f*u,t},rotateZ:function(t,n,a){var r=Math.sin(a),u=Math.cos(a),e=n[0],o=n[1],i=n[2],c=n[3],h=n[4],s=n[5],M=n[6],f=n[7];return n!==t&&(t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=e*u+h*r,t[1]=o*u+s*r,t[2]=i*u+M*r,t[3]=c*u+f*r,t[4]=h*u-e*r,t[5]=s*u-o*r,t[6]=M*u-i*r,t[7]=f*u-c*r,t},fromTranslation:function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t},fromScaling:function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=n[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},fromRotation:function(t,a,r){var u,e,o,i=r[0],c=r[1],h=r[2],s=Math.hypot(i,c,h);return s<n?null:(i*=s=1/s,c*=s,h*=s,u=Math.sin(a),o=1-(e=Math.cos(a)),t[0]=i*i*o+e,t[1]=c*i*o+h*u,t[2]=h*i*o-c*u,t[3]=0,t[4]=i*c*o-h*u,t[5]=c*c*o+e,t[6]=h*c*o+i*u,t[7]=0,t[8]=i*h*o+c*u,t[9]=c*h*o-i*u,t[10]=h*h*o+e,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)},fromXRotation:function(t,n){var a=Math.sin(n),r=Math.cos(n);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=r,t[6]=a,t[7]=0,t[8]=0,t[9]=-a,t[10]=r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},fromYRotation:function(t,n){var a=Math.sin(n),r=Math.cos(n);return t[0]=r,t[1]=0,t[2]=-a,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=a,t[9]=0,t[10]=r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},fromZRotation:function(t,n){var a=Math.sin(n),r=Math.cos(n);return t[0]=r,t[1]=a,t[2]=0,t[3]=0,t[4]=-a,t[5]=r,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},fromRotationTranslation:w,fromQuat2:function(t,n){var r=new a(3),u=-n[0],e=-n[1],o=-n[2],i=n[3],c=n[4],h=n[5],s=n[6],M=n[7],f=u*u+e*e+o*o+i*i;return f>0?(r[0]=2*(c*i+M*u+h*o-s*e)/f,r[1]=2*(h*i+M*e+s*u-c*o)/f,r[2]=2*(s*i+M*o+c*e-h*u)/f):(r[0]=2*(c*i+M*u+h*o-s*e),r[1]=2*(h*i+M*e+s*u-c*o),r[2]=2*(s*i+M*o+c*e-h*u)),w(t,n,r),t},getTranslation:R,getScaling:z,getRotation:P,fromRotationTranslationScale:function(t,n,a,r){var u=n[0],e=n[1],o=n[2],i=n[3],c=u+u,h=e+e,s=o+o,M=u*c,f=u*h,l=u*s,v=e*h,b=e*s,m=o*s,d=i*c,x=i*h,p=i*s,y=r[0],q=r[1],g=r[2];return t[0]=(1-(v+m))*y,t[1]=(f+p)*y,t[2]=(l-x)*y,t[3]=0,t[4]=(f-p)*q,t[5]=(1-(M+m))*q,t[6]=(b+d)*q,t[7]=0,t[8]=(l+x)*g,t[9]=(b-d)*g,t[10]=(1-(M+v))*g,t[11]=0,t[12]=a[0],t[13]=a[1],t[14]=a[2],t[15]=1,t},fromRotationTranslationScaleOrigin:function(t,n,a,r,u){var e=n[0],o=n[1],i=n[2],c=n[3],h=e+e,s=o+o,M=i+i,f=e*h,l=e*s,v=e*M,b=o*s,m=o*M,d=i*M,x=c*h,p=c*s,y=c*M,q=r[0],g=r[1],A=r[2],w=u[0],R=u[1],z=u[2],P=(1-(b+d))*q,j=(l+y)*q,I=(v-p)*q,S=(l-y)*g,E=(1-(f+d))*g,O=(m+x)*g,T=(v+p)*A,D=(m-x)*A,F=(1-(f+b))*A;return t[0]=P,t[1]=j,t[2]=I,t[3]=0,t[4]=S,t[5]=E,t[6]=O,t[7]=0,t[8]=T,t[9]=D,t[10]=F,t[11]=0,t[12]=a[0]+w-(P*w+S*R+T*z),t[13]=a[1]+R-(j*w+E*R+D*z),t[14]=a[2]+z-(I*w+O*R+F*z),t[15]=1,t},fromQuat:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=a+a,i=r+r,c=u+u,h=a*o,s=r*o,M=r*i,f=u*o,l=u*i,v=u*c,b=e*o,m=e*i,d=e*c;return t[0]=1-M-v,t[1]=s+d,t[2]=f-m,t[3]=0,t[4]=s-d,t[5]=1-h-v,t[6]=l+b,t[7]=0,t[8]=f+m,t[9]=l-b,t[10]=1-h-M,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},frustum:function(t,n,a,r,u,e,o){var i=1/(a-n),c=1/(u-r),h=1/(e-o);return t[0]=2*e*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*e*c,t[6]=0,t[7]=0,t[8]=(a+n)*i,t[9]=(u+r)*c,t[10]=(o+e)*h,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*e*2*h,t[15]=0,t},perspective:function(t,n,a,r,u){var e,o=1/Math.tan(n/2);return t[0]=o/a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,null!=u&&u!==1/0?(e=1/(r-u),t[10]=(u+r)*e,t[14]=2*u*r*e):(t[10]=-1,t[14]=-2*r),t},perspectiveFromFieldOfView:function(t,n,a,r){var u=Math.tan(n.upDegrees*Math.PI/180),e=Math.tan(n.downDegrees*Math.PI/180),o=Math.tan(n.leftDegrees*Math.PI/180),i=Math.tan(n.rightDegrees*Math.PI/180),c=2/(o+i),h=2/(u+e);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=h,t[6]=0,t[7]=0,t[8]=-(o-i)*c*.5,t[9]=(u-e)*h*.5,t[10]=r/(a-r),t[11]=-1,t[12]=0,t[13]=0,t[14]=r*a/(a-r),t[15]=0,t},ortho:function(t,n,a,r,u,e,o){var i=1/(n-a),c=1/(r-u),h=1/(e-o);return t[0]=-2*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*h,t[11]=0,t[12]=(n+a)*i,t[13]=(u+r)*c,t[14]=(o+e)*h,t[15]=1,t},lookAt:function(t,a,r,u){var e,o,i,c,h,s,M,f,l,v,b=a[0],m=a[1],d=a[2],x=u[0],p=u[1],y=u[2],q=r[0],A=r[1],w=r[2];return Math.abs(b-q)<n&&Math.abs(m-A)<n&&Math.abs(d-w)<n?g(t):(M=b-q,f=m-A,l=d-w,e=p*(l*=v=1/Math.hypot(M,f,l))-y*(f*=v),o=y*(M*=v)-x*l,i=x*f-p*M,(v=Math.hypot(e,o,i))?(e*=v=1/v,o*=v,i*=v):(e=0,o=0,i=0),c=f*i-l*o,h=l*e-M*i,s=M*o-f*e,(v=Math.hypot(c,h,s))?(c*=v=1/v,h*=v,s*=v):(c=0,h=0,s=0),t[0]=e,t[1]=c,t[2]=M,t[3]=0,t[4]=o,t[5]=h,t[6]=f,t[7]=0,t[8]=i,t[9]=s,t[10]=l,t[11]=0,t[12]=-(e*b+o*m+i*d),t[13]=-(c*b+h*m+s*d),t[14]=-(M*b+f*m+l*d),t[15]=1,t)},targetTo:function(t,n,a,r){var u=n[0],e=n[1],o=n[2],i=r[0],c=r[1],h=r[2],s=u-a[0],M=e-a[1],f=o-a[2],l=s*s+M*M+f*f;l>0&&(s*=l=1/Math.sqrt(l),M*=l,f*=l);var v=c*f-h*M,b=h*s-i*f,m=i*M-c*s;return(l=v*v+b*b+m*m)>0&&(v*=l=1/Math.sqrt(l),b*=l,m*=l),t[0]=v,t[1]=b,t[2]=m,t[3]=0,t[4]=M*m-f*b,t[5]=f*v-s*m,t[6]=s*b-M*v,t[7]=0,t[8]=s,t[9]=M,t[10]=f,t[11]=0,t[12]=u,t[13]=e,t[14]=o,t[15]=1,t},str:function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},frob:function(t){return Math.hypot(t[0],t[1],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15])},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t[3]=n[3]+a[3],t[4]=n[4]+a[4],t[5]=n[5]+a[5],t[6]=n[6]+a[6],t[7]=n[7]+a[7],t[8]=n[8]+a[8],t[9]=n[9]+a[9],t[10]=n[10]+a[10],t[11]=n[11]+a[11],t[12]=n[12]+a[12],t[13]=n[13]+a[13],t[14]=n[14]+a[14],t[15]=n[15]+a[15],t},subtract:j,multiplyScalar:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=n[7]*a,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=n[11]*a,t[12]=n[12]*a,t[13]=n[13]*a,t[14]=n[14]*a,t[15]=n[15]*a,t},multiplyScalarAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t[2]=n[2]+a[2]*r,t[3]=n[3]+a[3]*r,t[4]=n[4]+a[4]*r,t[5]=n[5]+a[5]*r,t[6]=n[6]+a[6]*r,t[7]=n[7]+a[7]*r,t[8]=n[8]+a[8]*r,t[9]=n[9]+a[9]*r,t[10]=n[10]+a[10]*r,t[11]=n[11]+a[11]*r,t[12]=n[12]+a[12]*r,t[13]=n[13]+a[13]*r,t[14]=n[14]+a[14]*r,t[15]=n[15]+a[15]*r,t},exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]&&t[8]===n[8]&&t[9]===n[9]&&t[10]===n[10]&&t[11]===n[11]&&t[12]===n[12]&&t[13]===n[13]&&t[14]===n[14]&&t[15]===n[15]},equals:function(t,a){var r=t[0],u=t[1],e=t[2],o=t[3],i=t[4],c=t[5],h=t[6],s=t[7],M=t[8],f=t[9],l=t[10],v=t[11],b=t[12],m=t[13],d=t[14],x=t[15],p=a[0],y=a[1],q=a[2],g=a[3],A=a[4],w=a[5],R=a[6],z=a[7],P=a[8],j=a[9],I=a[10],S=a[11],E=a[12],O=a[13],T=a[14],D=a[15];return Math.abs(r-p)<=n*Math.max(1,Math.abs(r),Math.abs(p))&&Math.abs(u-y)<=n*Math.max(1,Math.abs(u),Math.abs(y))&&Math.abs(e-q)<=n*Math.max(1,Math.abs(e),Math.abs(q))&&Math.abs(o-g)<=n*Math.max(1,Math.abs(o),Math.abs(g))&&Math.abs(i-A)<=n*Math.max(1,Math.abs(i),Math.abs(A))&&Math.abs(c-w)<=n*Math.max(1,Math.abs(c),Math.abs(w))&&Math.abs(h-R)<=n*Math.max(1,Math.abs(h),Math.abs(R))&&Math.abs(s-z)<=n*Math.max(1,Math.abs(s),Math.abs(z))&&Math.abs(M-P)<=n*Math.max(1,Math.abs(M),Math.abs(P))&&Math.abs(f-j)<=n*Math.max(1,Math.abs(f),Math.abs(j))&&Math.abs(l-I)<=n*Math.max(1,Math.abs(l),Math.abs(I))&&Math.abs(v-S)<=n*Math.max(1,Math.abs(v),Math.abs(S))&&Math.abs(b-E)<=n*Math.max(1,Math.abs(b),Math.abs(E))&&Math.abs(m-O)<=n*Math.max(1,Math.abs(m),Math.abs(O))&&Math.abs(d-T)<=n*Math.max(1,Math.abs(d),Math.abs(T))&&Math.abs(x-D)<=n*Math.max(1,Math.abs(x),Math.abs(D))},mul:I,sub:S});function O(){var t=new a(3);return a!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function T(t){var n=t[0],a=t[1],r=t[2];return Math.hypot(n,a,r)}function D(t,n,r){var u=new a(3);return u[0]=t,u[1]=n,u[2]=r,u}function F(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t[2]=n[2]-a[2],t}function L(t,n,a){return t[0]=n[0]*a[0],t[1]=n[1]*a[1],t[2]=n[2]*a[2],t}function V(t,n,a){return t[0]=n[0]/a[0],t[1]=n[1]/a[1],t[2]=n[2]/a[2],t}function Q(t,n){var a=n[0]-t[0],r=n[1]-t[1],u=n[2]-t[2];return Math.hypot(a,r,u)}function Y(t,n){var a=n[0]-t[0],r=n[1]-t[1],u=n[2]-t[2];return a*a+r*r+u*u}function X(t){var n=t[0],a=t[1],r=t[2];return n*n+a*a+r*r}function Z(t,n){var a=n[0],r=n[1],u=n[2],e=a*a+r*r+u*u;return e>0&&(e=1/Math.sqrt(e)),t[0]=n[0]*e,t[1]=n[1]*e,t[2]=n[2]*e,t}function _(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}function B(t,n,a){var r=n[0],u=n[1],e=n[2],o=a[0],i=a[1],c=a[2];return t[0]=u*c-e*i,t[1]=e*o-r*c,t[2]=r*i-u*o,t}var N,k=F,U=L,W=V,C=Q,G=Y,H=T,J=X,K=(N=O(),function(t,n,a,r,u,e){var o,i;for(n||(n=3),a||(a=0),i=r?Math.min(r*n+a,t.length):t.length,o=a;o<i;o+=n)N[0]=t[o],N[1]=t[o+1],N[2]=t[o+2],u(N,N,e),t[o]=N[0],t[o+1]=N[1],t[o+2]=N[2];return t}),$=Object.freeze({create:O,clone:function(t){var n=new a(3);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n},length:T,fromValues:D,copy:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t},set:function(t,n,a,r){return t[0]=n,t[1]=a,t[2]=r,t},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t},subtract:F,multiply:L,divide:V,ceil:function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t},floor:function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t},min:function(t,n,a){return t[0]=Math.min(n[0],a[0]),t[1]=Math.min(n[1],a[1]),t[2]=Math.min(n[2],a[2]),t},max:function(t,n,a){return t[0]=Math.max(n[0],a[0]),t[1]=Math.max(n[1],a[1]),t[2]=Math.max(n[2],a[2]),t},round:function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t},scale:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t},scaleAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t[2]=n[2]+a[2]*r,t},distance:Q,squaredDistance:Y,squaredLength:X,negate:function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t},inverse:function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t},normalize:Z,dot:_,cross:B,lerp:function(t,n,a,r){var u=n[0],e=n[1],o=n[2];return t[0]=u+r*(a[0]-u),t[1]=e+r*(a[1]-e),t[2]=o+r*(a[2]-o),t},hermite:function(t,n,a,r,u,e){var o=e*e,i=o*(2*e-3)+1,c=o*(e-2)+e,h=o*(e-1),s=o*(3-2*e);return t[0]=n[0]*i+a[0]*c+r[0]*h+u[0]*s,t[1]=n[1]*i+a[1]*c+r[1]*h+u[1]*s,t[2]=n[2]*i+a[2]*c+r[2]*h+u[2]*s,t},bezier:function(t,n,a,r,u,e){var o=1-e,i=o*o,c=e*e,h=i*o,s=3*e*i,M=3*c*o,f=c*e;return t[0]=n[0]*h+a[0]*s+r[0]*M+u[0]*f,t[1]=n[1]*h+a[1]*s+r[1]*M+u[1]*f,t[2]=n[2]*h+a[2]*s+r[2]*M+u[2]*f,t},random:function(t,n){n=n||1;var a=2*r()*Math.PI,u=2*r()-1,e=Math.sqrt(1-u*u)*n;return t[0]=Math.cos(a)*e,t[1]=Math.sin(a)*e,t[2]=u*n,t},transformMat4:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=a[3]*r+a[7]*u+a[11]*e+a[15];return o=o||1,t[0]=(a[0]*r+a[4]*u+a[8]*e+a[12])/o,t[1]=(a[1]*r+a[5]*u+a[9]*e+a[13])/o,t[2]=(a[2]*r+a[6]*u+a[10]*e+a[14])/o,t},transformMat3:function(t,n,a){var r=n[0],u=n[1],e=n[2];return t[0]=r*a[0]+u*a[3]+e*a[6],t[1]=r*a[1]+u*a[4]+e*a[7],t[2]=r*a[2]+u*a[5]+e*a[8],t},transformQuat:function(t,n,a){var r=a[0],u=a[1],e=a[2],o=a[3],i=n[0],c=n[1],h=n[2],s=u*h-e*c,M=e*i-r*h,f=r*c-u*i,l=u*f-e*M,v=e*s-r*f,b=r*M-u*s,m=2*o;return s*=m,M*=m,f*=m,l*=2,v*=2,b*=2,t[0]=i+s+l,t[1]=c+M+v,t[2]=h+f+b,t},rotateX:function(t,n,a,r){var u=[],e=[];return u[0]=n[0]-a[0],u[1]=n[1]-a[1],u[2]=n[2]-a[2],e[0]=u[0],e[1]=u[1]*Math.cos(r)-u[2]*Math.sin(r),e[2]=u[1]*Math.sin(r)+u[2]*Math.cos(r),t[0]=e[0]+a[0],t[1]=e[1]+a[1],t[2]=e[2]+a[2],t},rotateY:function(t,n,a,r){var u=[],e=[];return u[0]=n[0]-a[0],u[1]=n[1]-a[1],u[2]=n[2]-a[2],e[0]=u[2]*Math.sin(r)+u[0]*Math.cos(r),e[1]=u[1],e[2]=u[2]*Math.cos(r)-u[0]*Math.sin(r),t[0]=e[0]+a[0],t[1]=e[1]+a[1],t[2]=e[2]+a[2],t},rotateZ:function(t,n,a,r){var u=[],e=[];return u[0]=n[0]-a[0],u[1]=n[1]-a[1],u[2]=n[2]-a[2],e[0]=u[0]*Math.cos(r)-u[1]*Math.sin(r),e[1]=u[0]*Math.sin(r)+u[1]*Math.cos(r),e[2]=u[2],t[0]=e[0]+a[0],t[1]=e[1]+a[1],t[2]=e[2]+a[2],t},angle:function(t,n){var a=D(t[0],t[1],t[2]),r=D(n[0],n[1],n[2]);Z(a,a),Z(r,r);var u=_(a,r);return u>1?0:u<-1?Math.PI:Math.acos(u)},zero:function(t){return t[0]=0,t[1]=0,t[2]=0,t},str:function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]},equals:function(t,a){var r=t[0],u=t[1],e=t[2],o=a[0],i=a[1],c=a[2];return Math.abs(r-o)<=n*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(u-i)<=n*Math.max(1,Math.abs(u),Math.abs(i))&&Math.abs(e-c)<=n*Math.max(1,Math.abs(e),Math.abs(c))},sub:k,mul:U,div:W,dist:C,sqrDist:G,len:H,sqrLen:J,forEach:K});function tt(){var t=new a(4);return a!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function nt(t){var n=new a(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n}function at(t,n,r,u){var e=new a(4);return e[0]=t,e[1]=n,e[2]=r,e[3]=u,e}function rt(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t}function ut(t,n,a,r,u){return t[0]=n,t[1]=a,t[2]=r,t[3]=u,t}function et(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t[3]=n[3]+a[3],t}function ot(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t[2]=n[2]-a[2],t[3]=n[3]-a[3],t}function it(t,n,a){return t[0]=n[0]*a[0],t[1]=n[1]*a[1],t[2]=n[2]*a[2],t[3]=n[3]*a[3],t}function ct(t,n,a){return t[0]=n[0]/a[0],t[1]=n[1]/a[1],t[2]=n[2]/a[2],t[3]=n[3]/a[3],t}function ht(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t}function st(t,n){var a=n[0]-t[0],r=n[1]-t[1],u=n[2]-t[2],e=n[3]-t[3];return Math.hypot(a,r,u,e)}function Mt(t,n){var a=n[0]-t[0],r=n[1]-t[1],u=n[2]-t[2],e=n[3]-t[3];return a*a+r*r+u*u+e*e}function ft(t){var n=t[0],a=t[1],r=t[2],u=t[3];return Math.hypot(n,a,r,u)}function lt(t){var n=t[0],a=t[1],r=t[2],u=t[3];return n*n+a*a+r*r+u*u}function vt(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=a*a+r*r+u*u+e*e;return o>0&&(o=1/Math.sqrt(o)),t[0]=a*o,t[1]=r*o,t[2]=u*o,t[3]=e*o,t}function bt(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]}function mt(t,n,a,r){var u=n[0],e=n[1],o=n[2],i=n[3];return t[0]=u+r*(a[0]-u),t[1]=e+r*(a[1]-e),t[2]=o+r*(a[2]-o),t[3]=i+r*(a[3]-i),t}function dt(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]}function xt(t,a){var r=t[0],u=t[1],e=t[2],o=t[3],i=a[0],c=a[1],h=a[2],s=a[3];return Math.abs(r-i)<=n*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(u-c)<=n*Math.max(1,Math.abs(u),Math.abs(c))&&Math.abs(e-h)<=n*Math.max(1,Math.abs(e),Math.abs(h))&&Math.abs(o-s)<=n*Math.max(1,Math.abs(o),Math.abs(s))}var pt=ot,yt=it,qt=ct,gt=st,At=Mt,wt=ft,Rt=lt,zt=function(){var t=tt();return function(n,a,r,u,e,o){var i,c;for(a||(a=4),r||(r=0),c=u?Math.min(u*a+r,n.length):n.length,i=r;i<c;i+=a)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],t[3]=n[i+3],e(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3];return n}}(),Pt=Object.freeze({create:tt,clone:nt,fromValues:at,copy:rt,set:ut,add:et,subtract:ot,multiply:it,divide:ct,ceil:function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t[3]=Math.ceil(n[3]),t},floor:function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t[3]=Math.floor(n[3]),t},min:function(t,n,a){return t[0]=Math.min(n[0],a[0]),t[1]=Math.min(n[1],a[1]),t[2]=Math.min(n[2],a[2]),t[3]=Math.min(n[3],a[3]),t},max:function(t,n,a){return t[0]=Math.max(n[0],a[0]),t[1]=Math.max(n[1],a[1]),t[2]=Math.max(n[2],a[2]),t[3]=Math.max(n[3],a[3]),t},round:function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t[3]=Math.round(n[3]),t},scale:ht,scaleAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t[2]=n[2]+a[2]*r,t[3]=n[3]+a[3]*r,t},distance:st,squaredDistance:Mt,length:ft,squaredLength:lt,negate:function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=-n[3],t},inverse:function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t[3]=1/n[3],t},normalize:vt,dot:bt,cross:function(t,n,a,r){var u=a[0]*r[1]-a[1]*r[0],e=a[0]*r[2]-a[2]*r[0],o=a[0]*r[3]-a[3]*r[0],i=a[1]*r[2]-a[2]*r[1],c=a[1]*r[3]-a[3]*r[1],h=a[2]*r[3]-a[3]*r[2],s=n[0],M=n[1],f=n[2],l=n[3];return t[0]=M*h-f*c+l*i,t[1]=-s*h+f*o-l*e,t[2]=s*c-M*o+l*u,t[3]=-s*i+M*e-f*u,t},lerp:mt,random:function(t,n){var a,u,e,o,i,c;n=n||1;do{i=(a=2*r()-1)*a+(u=2*r()-1)*u}while(i>=1);do{c=(e=2*r()-1)*e+(o=2*r()-1)*o}while(c>=1);var h=Math.sqrt((1-i)/c);return t[0]=n*a,t[1]=n*u,t[2]=n*e*h,t[3]=n*o*h,t},transformMat4:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3];return t[0]=a[0]*r+a[4]*u+a[8]*e+a[12]*o,t[1]=a[1]*r+a[5]*u+a[9]*e+a[13]*o,t[2]=a[2]*r+a[6]*u+a[10]*e+a[14]*o,t[3]=a[3]*r+a[7]*u+a[11]*e+a[15]*o,t},transformQuat:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=a[0],i=a[1],c=a[2],h=a[3],s=h*r+i*e-c*u,M=h*u+c*r-o*e,f=h*e+o*u-i*r,l=-o*r-i*u-c*e;return t[0]=s*h+l*-o+M*-c-f*-i,t[1]=M*h+l*-i+f*-o-s*-c,t[2]=f*h+l*-c+s*-i-M*-o,t[3]=n[3],t},zero:function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},str:function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},exactEquals:dt,equals:xt,sub:pt,mul:yt,div:qt,dist:gt,sqrDist:At,len:wt,sqrLen:Rt,forEach:zt});function jt(){var t=new a(4);return a!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function It(t,n,a){a*=.5;var r=Math.sin(a);return t[0]=r*n[0],t[1]=r*n[1],t[2]=r*n[2],t[3]=Math.cos(a),t}function St(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=a[0],c=a[1],h=a[2],s=a[3];return t[0]=r*s+o*i+u*h-e*c,t[1]=u*s+o*c+e*i-r*h,t[2]=e*s+o*h+r*c-u*i,t[3]=o*s-r*i-u*c-e*h,t}function Et(t,n,a){a*=.5;var r=n[0],u=n[1],e=n[2],o=n[3],i=Math.sin(a),c=Math.cos(a);return t[0]=r*c+o*i,t[1]=u*c+e*i,t[2]=e*c-u*i,t[3]=o*c-r*i,t}function Ot(t,n,a){a*=.5;var r=n[0],u=n[1],e=n[2],o=n[3],i=Math.sin(a),c=Math.cos(a);return t[0]=r*c-e*i,t[1]=u*c+o*i,t[2]=e*c+r*i,t[3]=o*c-u*i,t}function Tt(t,n,a){a*=.5;var r=n[0],u=n[1],e=n[2],o=n[3],i=Math.sin(a),c=Math.cos(a);return t[0]=r*c+u*i,t[1]=u*c-r*i,t[2]=e*c+o*i,t[3]=o*c-e*i,t}function Dt(t,a,r,u){var e,o,i,c,h,s=a[0],M=a[1],f=a[2],l=a[3],v=r[0],b=r[1],m=r[2],d=r[3];return(o=s*v+M*b+f*m+l*d)<0&&(o=-o,v=-v,b=-b,m=-m,d=-d),1-o>n?(e=Math.acos(o),i=Math.sin(e),c=Math.sin((1-u)*e)/i,h=Math.sin(u*e)/i):(c=1-u,h=u),t[0]=c*s+h*v,t[1]=c*M+h*b,t[2]=c*f+h*m,t[3]=c*l+h*d,t}function Ft(t,n){var a,r=n[0]+n[4]+n[8];if(r>0)a=Math.sqrt(r+1),t[3]=.5*a,a=.5/a,t[0]=(n[5]-n[7])*a,t[1]=(n[6]-n[2])*a,t[2]=(n[1]-n[3])*a;else{var u=0;n[4]>n[0]&&(u=1),n[8]>n[3*u+u]&&(u=2);var e=(u+1)%3,o=(u+2)%3;a=Math.sqrt(n[3*u+u]-n[3*e+e]-n[3*o+o]+1),t[u]=.5*a,a=.5/a,t[3]=(n[3*e+o]-n[3*o+e])*a,t[e]=(n[3*e+u]+n[3*u+e])*a,t[o]=(n[3*o+u]+n[3*u+o])*a}return t}var Lt,Vt,Qt,Yt,Xt,Zt,_t=nt,Bt=at,Nt=rt,kt=ut,Ut=et,Wt=St,Ct=ht,Gt=bt,Ht=mt,Jt=ft,Kt=Jt,$t=lt,tn=$t,nn=vt,an=dt,rn=xt,un=(Lt=O(),Vt=D(1,0,0),Qt=D(0,1,0),function(t,n,a){var r=_(n,a);return r<-.999999?(B(Lt,Vt,n),H(Lt)<1e-6&&B(Lt,Qt,n),Z(Lt,Lt),It(t,Lt,Math.PI),t):r>.999999?(t[0]=0,t[1]=0,t[2]=0,t[3]=1,t):(B(Lt,n,a),t[0]=Lt[0],t[1]=Lt[1],t[2]=Lt[2],t[3]=1+r,nn(t,t))}),en=(Yt=jt(),Xt=jt(),function(t,n,a,r,u,e){return Dt(Yt,n,u,e),Dt(Xt,a,r,e),Dt(t,Yt,Xt,2*e*(1-e)),t}),on=(Zt=m(),function(t,n,a,r){return Zt[0]=a[0],Zt[3]=a[1],Zt[6]=a[2],Zt[1]=r[0],Zt[4]=r[1],Zt[7]=r[2],Zt[2]=-n[0],Zt[5]=-n[1],Zt[8]=-n[2],nn(t,Ft(t,Zt))}),cn=Object.freeze({create:jt,identity:function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},setAxisAngle:It,getAxisAngle:function(t,a){var r=2*Math.acos(a[3]),u=Math.sin(r/2);return u>n?(t[0]=a[0]/u,t[1]=a[1]/u,t[2]=a[2]/u):(t[0]=1,t[1]=0,t[2]=0),r},multiply:St,rotateX:Et,rotateY:Ot,rotateZ:Tt,calculateW:function(t,n){var a=n[0],r=n[1],u=n[2];return t[0]=a,t[1]=r,t[2]=u,t[3]=Math.sqrt(Math.abs(1-a*a-r*r-u*u)),t},slerp:Dt,random:function(t){var n=r(),a=r(),u=r(),e=Math.sqrt(1-n),o=Math.sqrt(n);return t[0]=e*Math.sin(2*Math.PI*a),t[1]=e*Math.cos(2*Math.PI*a),t[2]=o*Math.sin(2*Math.PI*u),t[3]=o*Math.cos(2*Math.PI*u),t},invert:function(t,n){var a=n[0],r=n[1],u=n[2],e=n[3],o=a*a+r*r+u*u+e*e,i=o?1/o:0;return t[0]=-a*i,t[1]=-r*i,t[2]=-u*i,t[3]=e*i,t},conjugate:function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t},fromMat3:Ft,fromEuler:function(t,n,a,r){var u=.5*Math.PI/180;n*=u,a*=u,r*=u;var e=Math.sin(n),o=Math.cos(n),i=Math.sin(a),c=Math.cos(a),h=Math.sin(r),s=Math.cos(r);return t[0]=e*c*s-o*i*h,t[1]=o*i*s+e*c*h,t[2]=o*c*h-e*i*s,t[3]=o*c*s+e*i*h,t},str:function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},clone:_t,fromValues:Bt,copy:Nt,set:kt,add:Ut,mul:Wt,scale:Ct,dot:Gt,lerp:Ht,length:Jt,len:Kt,squaredLength:$t,sqrLen:tn,normalize:nn,exactEquals:an,equals:rn,rotationTo:un,sqlerp:en,setAxes:on});function hn(t,n,a){var r=.5*a[0],u=.5*a[1],e=.5*a[2],o=n[0],i=n[1],c=n[2],h=n[3];return t[0]=o,t[1]=i,t[2]=c,t[3]=h,t[4]=r*h+u*c-e*i,t[5]=u*h+e*o-r*c,t[6]=e*h+r*i-u*o,t[7]=-r*o-u*i-e*c,t}function sn(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t}var Mn=Nt;var fn=Nt;function ln(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=a[4],c=a[5],h=a[6],s=a[7],M=n[4],f=n[5],l=n[6],v=n[7],b=a[0],m=a[1],d=a[2],x=a[3];return t[0]=r*x+o*b+u*d-e*m,t[1]=u*x+o*m+e*b-r*d,t[2]=e*x+o*d+r*m-u*b,t[3]=o*x-r*b-u*m-e*d,t[4]=r*s+o*i+u*h-e*c+M*x+v*b+f*d-l*m,t[5]=u*s+o*c+e*i-r*h+f*x+v*m+l*b-M*d,t[6]=e*s+o*h+r*c-u*i+l*x+v*d+M*m-f*b,t[7]=o*s-r*i-u*c-e*h+v*x-M*b-f*m-l*d,t}var vn=ln;var bn=Gt;var mn=Jt,dn=mn,xn=$t,pn=xn;var yn=Object.freeze({create:function(){var t=new a(8);return a!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0),t[3]=1,t},clone:function(t){var n=new a(8);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n},fromValues:function(t,n,r,u,e,o,i,c){var h=new a(8);return h[0]=t,h[1]=n,h[2]=r,h[3]=u,h[4]=e,h[5]=o,h[6]=i,h[7]=c,h},fromRotationTranslationValues:function(t,n,r,u,e,o,i){var c=new a(8);c[0]=t,c[1]=n,c[2]=r,c[3]=u;var h=.5*e,s=.5*o,M=.5*i;return c[4]=h*u+s*r-M*n,c[5]=s*u+M*t-h*r,c[6]=M*u+h*n-s*t,c[7]=-h*t-s*n-M*r,c},fromRotationTranslation:hn,fromTranslation:function(t,n){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=.5*n[0],t[5]=.5*n[1],t[6]=.5*n[2],t[7]=0,t},fromRotation:function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=0,t[5]=0,t[6]=0,t[7]=0,t},fromMat4:function(t,n){var r=jt();P(r,n);var u=new a(3);return R(u,n),hn(t,r,u),t},copy:sn,identity:function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t},set:function(t,n,a,r,u,e,o,i,c){return t[0]=n,t[1]=a,t[2]=r,t[3]=u,t[4]=e,t[5]=o,t[6]=i,t[7]=c,t},getReal:Mn,getDual:function(t,n){return t[0]=n[4],t[1]=n[5],t[2]=n[6],t[3]=n[7],t},setReal:fn,setDual:function(t,n){return t[4]=n[0],t[5]=n[1],t[6]=n[2],t[7]=n[3],t},getTranslation:function(t,n){var a=n[4],r=n[5],u=n[6],e=n[7],o=-n[0],i=-n[1],c=-n[2],h=n[3];return t[0]=2*(a*h+e*o+r*c-u*i),t[1]=2*(r*h+e*i+u*o-a*c),t[2]=2*(u*h+e*c+a*i-r*o),t},translate:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=.5*a[0],c=.5*a[1],h=.5*a[2],s=n[4],M=n[5],f=n[6],l=n[7];return t[0]=r,t[1]=u,t[2]=e,t[3]=o,t[4]=o*i+u*h-e*c+s,t[5]=o*c+e*i-r*h+M,t[6]=o*h+r*c-u*i+f,t[7]=-r*i-u*c-e*h+l,t},rotateX:function(t,n,a){var r=-n[0],u=-n[1],e=-n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=i*o+s*r+c*e-h*u,f=c*o+s*u+h*r-i*e,l=h*o+s*e+i*u-c*r,v=s*o-i*r-c*u-h*e;return Et(t,n,a),r=t[0],u=t[1],e=t[2],o=t[3],t[4]=M*o+v*r+f*e-l*u,t[5]=f*o+v*u+l*r-M*e,t[6]=l*o+v*e+M*u-f*r,t[7]=v*o-M*r-f*u-l*e,t},rotateY:function(t,n,a){var r=-n[0],u=-n[1],e=-n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=i*o+s*r+c*e-h*u,f=c*o+s*u+h*r-i*e,l=h*o+s*e+i*u-c*r,v=s*o-i*r-c*u-h*e;return Ot(t,n,a),r=t[0],u=t[1],e=t[2],o=t[3],t[4]=M*o+v*r+f*e-l*u,t[5]=f*o+v*u+l*r-M*e,t[6]=l*o+v*e+M*u-f*r,t[7]=v*o-M*r-f*u-l*e,t},rotateZ:function(t,n,a){var r=-n[0],u=-n[1],e=-n[2],o=n[3],i=n[4],c=n[5],h=n[6],s=n[7],M=i*o+s*r+c*e-h*u,f=c*o+s*u+h*r-i*e,l=h*o+s*e+i*u-c*r,v=s*o-i*r-c*u-h*e;return Tt(t,n,a),r=t[0],u=t[1],e=t[2],o=t[3],t[4]=M*o+v*r+f*e-l*u,t[5]=f*o+v*u+l*r-M*e,t[6]=l*o+v*e+M*u-f*r,t[7]=v*o-M*r-f*u-l*e,t},rotateByQuatAppend:function(t,n,a){var r=a[0],u=a[1],e=a[2],o=a[3],i=n[0],c=n[1],h=n[2],s=n[3];return t[0]=i*o+s*r+c*e-h*u,t[1]=c*o+s*u+h*r-i*e,t[2]=h*o+s*e+i*u-c*r,t[3]=s*o-i*r-c*u-h*e,i=n[4],c=n[5],h=n[6],s=n[7],t[4]=i*o+s*r+c*e-h*u,t[5]=c*o+s*u+h*r-i*e,t[6]=h*o+s*e+i*u-c*r,t[7]=s*o-i*r-c*u-h*e,t},rotateByQuatPrepend:function(t,n,a){var r=n[0],u=n[1],e=n[2],o=n[3],i=a[0],c=a[1],h=a[2],s=a[3];return t[0]=r*s+o*i+u*h-e*c,t[1]=u*s+o*c+e*i-r*h,t[2]=e*s+o*h+r*c-u*i,t[3]=o*s-r*i-u*c-e*h,i=a[4],c=a[5],h=a[6],s=a[7],t[4]=r*s+o*i+u*h-e*c,t[5]=u*s+o*c+e*i-r*h,t[6]=e*s+o*h+r*c-u*i,t[7]=o*s-r*i-u*c-e*h,t},rotateAroundAxis:function(t,a,r,u){if(Math.abs(u)<n)return sn(t,a);var e=Math.hypot(r[0],r[1],r[2]);u*=.5;var o=Math.sin(u),i=o*r[0]/e,c=o*r[1]/e,h=o*r[2]/e,s=Math.cos(u),M=a[0],f=a[1],l=a[2],v=a[3];t[0]=M*s+v*i+f*h-l*c,t[1]=f*s+v*c+l*i-M*h,t[2]=l*s+v*h+M*c-f*i,t[3]=v*s-M*i-f*c-l*h;var b=a[4],m=a[5],d=a[6],x=a[7];return t[4]=b*s+x*i+m*h-d*c,t[5]=m*s+x*c+d*i-b*h,t[6]=d*s+x*h+b*c-m*i,t[7]=x*s-b*i-m*c-d*h,t},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t[2]=n[2]+a[2],t[3]=n[3]+a[3],t[4]=n[4]+a[4],t[5]=n[5]+a[5],t[6]=n[6]+a[6],t[7]=n[7]+a[7],t},multiply:ln,mul:vn,scale:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=n[7]*a,t},dot:bn,lerp:function(t,n,a,r){var u=1-r;return bn(n,a)<0&&(r=-r),t[0]=n[0]*u+a[0]*r,t[1]=n[1]*u+a[1]*r,t[2]=n[2]*u+a[2]*r,t[3]=n[3]*u+a[3]*r,t[4]=n[4]*u+a[4]*r,t[5]=n[5]*u+a[5]*r,t[6]=n[6]*u+a[6]*r,t[7]=n[7]*u+a[7]*r,t},invert:function(t,n){var a=xn(n);return t[0]=-n[0]/a,t[1]=-n[1]/a,t[2]=-n[2]/a,t[3]=n[3]/a,t[4]=-n[4]/a,t[5]=-n[5]/a,t[6]=-n[6]/a,t[7]=n[7]/a,t},conjugate:function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t[4]=-n[4],t[5]=-n[5],t[6]=-n[6],t[7]=n[7],t},length:mn,len:dn,squaredLength:xn,sqrLen:pn,normalize:function(t,n){var a=xn(n);if(a>0){a=Math.sqrt(a);var r=n[0]/a,u=n[1]/a,e=n[2]/a,o=n[3]/a,i=n[4],c=n[5],h=n[6],s=n[7],M=r*i+u*c+e*h+o*s;t[0]=r,t[1]=u,t[2]=e,t[3]=o,t[4]=(i-r*M)/a,t[5]=(c-u*M)/a,t[6]=(h-e*M)/a,t[7]=(s-o*M)/a}return t},str:function(t){return"quat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+")"},exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]},equals:function(t,a){var r=t[0],u=t[1],e=t[2],o=t[3],i=t[4],c=t[5],h=t[6],s=t[7],M=a[0],f=a[1],l=a[2],v=a[3],b=a[4],m=a[5],d=a[6],x=a[7];return Math.abs(r-M)<=n*Math.max(1,Math.abs(r),Math.abs(M))&&Math.abs(u-f)<=n*Math.max(1,Math.abs(u),Math.abs(f))&&Math.abs(e-l)<=n*Math.max(1,Math.abs(e),Math.abs(l))&&Math.abs(o-v)<=n*Math.max(1,Math.abs(o),Math.abs(v))&&Math.abs(i-b)<=n*Math.max(1,Math.abs(i),Math.abs(b))&&Math.abs(c-m)<=n*Math.max(1,Math.abs(c),Math.abs(m))&&Math.abs(h-d)<=n*Math.max(1,Math.abs(h),Math.abs(d))&&Math.abs(s-x)<=n*Math.max(1,Math.abs(s),Math.abs(x))}});function qn(){var t=new a(2);return a!=Float32Array&&(t[0]=0,t[1]=0),t}function gn(t,n,a){return t[0]=n[0]-a[0],t[1]=n[1]-a[1],t}function An(t,n,a){return t[0]=n[0]*a[0],t[1]=n[1]*a[1],t}function wn(t,n,a){return t[0]=n[0]/a[0],t[1]=n[1]/a[1],t}function Rn(t,n){var a=n[0]-t[0],r=n[1]-t[1];return Math.hypot(a,r)}function zn(t,n){var a=n[0]-t[0],r=n[1]-t[1];return a*a+r*r}function Pn(t){var n=t[0],a=t[1];return Math.hypot(n,a)}function jn(t){var n=t[0],a=t[1];return n*n+a*a}var In=Pn,Sn=gn,En=An,On=wn,Tn=Rn,Dn=zn,Fn=jn,Ln=function(){var t=qn();return function(n,a,r,u,e,o){var i,c;for(a||(a=2),r||(r=0),c=u?Math.min(u*a+r,n.length):n.length,i=r;i<c;i+=a)t[0]=n[i],t[1]=n[i+1],e(t,t,o),n[i]=t[0],n[i+1]=t[1];return n}}(),Vn=Object.freeze({create:qn,clone:function(t){var n=new a(2);return n[0]=t[0],n[1]=t[1],n},fromValues:function(t,n){var r=new a(2);return r[0]=t,r[1]=n,r},copy:function(t,n){return t[0]=n[0],t[1]=n[1],t},set:function(t,n,a){return t[0]=n,t[1]=a,t},add:function(t,n,a){return t[0]=n[0]+a[0],t[1]=n[1]+a[1],t},subtract:gn,multiply:An,divide:wn,ceil:function(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t},floor:function(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t},min:function(t,n,a){return t[0]=Math.min(n[0],a[0]),t[1]=Math.min(n[1],a[1]),t},max:function(t,n,a){return t[0]=Math.max(n[0],a[0]),t[1]=Math.max(n[1],a[1]),t},round:function(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t},scale:function(t,n,a){return t[0]=n[0]*a,t[1]=n[1]*a,t},scaleAndAdd:function(t,n,a,r){return t[0]=n[0]+a[0]*r,t[1]=n[1]+a[1]*r,t},distance:Rn,squaredDistance:zn,length:Pn,squaredLength:jn,negate:function(t,n){return t[0]=-n[0],t[1]=-n[1],t},inverse:function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t},normalize:function(t,n){var a=n[0],r=n[1],u=a*a+r*r;return u>0&&(u=1/Math.sqrt(u)),t[0]=n[0]*u,t[1]=n[1]*u,t},dot:function(t,n){return t[0]*n[0]+t[1]*n[1]},cross:function(t,n,a){var r=n[0]*a[1]-n[1]*a[0];return t[0]=t[1]=0,t[2]=r,t},lerp:function(t,n,a,r){var u=n[0],e=n[1];return t[0]=u+r*(a[0]-u),t[1]=e+r*(a[1]-e),t},random:function(t,n){n=n||1;var a=2*r()*Math.PI;return t[0]=Math.cos(a)*n,t[1]=Math.sin(a)*n,t},transformMat2:function(t,n,a){var r=n[0],u=n[1];return t[0]=a[0]*r+a[2]*u,t[1]=a[1]*r+a[3]*u,t},transformMat2d:function(t,n,a){var r=n[0],u=n[1];return t[0]=a[0]*r+a[2]*u+a[4],t[1]=a[1]*r+a[3]*u+a[5],t},transformMat3:function(t,n,a){var r=n[0],u=n[1];return t[0]=a[0]*r+a[3]*u+a[6],t[1]=a[1]*r+a[4]*u+a[7],t},transformMat4:function(t,n,a){var r=n[0],u=n[1];return t[0]=a[0]*r+a[4]*u+a[12],t[1]=a[1]*r+a[5]*u+a[13],t},rotate:function(t,n,a,r){var u=n[0]-a[0],e=n[1]-a[1],o=Math.sin(r),i=Math.cos(r);return t[0]=u*i-e*o+a[0],t[1]=u*o+e*i+a[1],t},angle:function(t,n){var a=t[0],r=t[1],u=n[0],e=n[1],o=a*a+r*r;o>0&&(o=1/Math.sqrt(o));var i=u*u+e*e;i>0&&(i=1/Math.sqrt(i));var c=(a*u+r*e)*o*i;return c>1?0:c<-1?Math.PI:Math.acos(c)},zero:function(t){return t[0]=0,t[1]=0,t},str:function(t){return"vec2("+t[0]+", "+t[1]+")"},exactEquals:function(t,n){return t[0]===n[0]&&t[1]===n[1]},equals:function(t,a){var r=t[0],u=t[1],e=a[0],o=a[1];return Math.abs(r-e)<=n*Math.max(1,Math.abs(r),Math.abs(e))&&Math.abs(u-o)<=n*Math.max(1,Math.abs(u),Math.abs(o))},len:In,sub:Sn,mul:En,div:On,dist:Tn,sqrDist:Dn,sqrLen:Fn,forEach:Ln});t.glMatrix=e,t.mat2=s,t.mat2d=b,t.mat3=q,t.mat4=E,t.quat=cn,t.quat2=yn,t.vec2=Vn,t.vec3=$,t.vec4=Pt,Object.defineProperty(t,"__esModule",{value:!0})});


self.importScripts('prismarine-script.js');





//Definitions

//Changes to 1 after init
var start = 0;
//Length of 1D block array
var blockLen=0;
//Camera location
var cam=[0,0,0];
//Camera offset
var xx=-1;
var yy=-1;
var zz=-1;


//List of messages we are going to send 
var sendList=[];

//List of active chunks 
var activeChunks=[];

//How far to draw out
var viewDist=10;
//How far to draw down/up
var zView=4;

//Chunk Dimensions
var chunkXY=0;
var chunkZ=0;
var chunkSpace=200;
//Chunk List
var chunk=[];
//Returnx X,Y,Z from index
var chunkInd=[];
//Empty chunk 
var chunkList=[];

//Draw color
var color=5;




//Returns chunkID from x,y,z in block space
return_chunkID = function(x,y,z){
	return(x+y*chunkSpace+z*chunkSpace*chunkSpace);
}




chunk_create = function(x,y,z){
	//If chunk doesn't already exist
	var chunkID = return_chunkID(x,y,z);
	if(chunk[chunkID]==null){
		activeChunks.push(chunkID);
		//Create new chunk
		chunk[chunkID]={
			//coordinates
			coords : [x,y,z],
			//list of blocks
			//blockList : chunkList.slice(),
			//list of culled blocks
			//culledList : chunkList.slice(),
			//Whether the chunk needs to be redrawn
			chunkreDraw : 1,	
			drawLength : 0,
			chunkChanged : 1,
			sendList : 1,
		}
		
	}
	chunk[chunkID].blockList = 	 new Uint8Array(blockLen);
	chunk[chunkID].blockList.fill(0);


	


	return(chunkID);
}




//Gets real XYZ from chunk x y z and id
block_location = function(x,y,z,id){
	return([chunkInd[id][0]+x*chunkXY,chunkInd[id][1]+y*chunkXY,chunkInd[id][2]+z*chunkZ]);

}

//gets id from XYZ
location_block = function(x,y,z){

	//get Chunk location
	var chunkRef = chunk_get(x,y,z);
	var chunkID = return_chunkID(chunkRef[0],chunkRef[1],chunkRef[2]);
	//get relative location in chunk
	var blockLoc = [x - (chunkRef[0]*chunkXY), y - (chunkRef[1]*chunkXY),z-(chunkRef[2]*chunkZ)]
	//get index from relative location

	//If its in a non existant chunk send back a -1
	if(chunk[chunkID]==null ){return(-1);}
	return( [ chunkID, blockLoc[0]+blockLoc[1]*chunkXY+blockLoc[2]*chunkXY*chunkXY]);
	
}


//Checks if block exists from XYZ
block_exists = function ( x,y,z ) {
	//get ID from xyz
	var blockId = location_block(x,y,z);
	//If the chunk exists
	if(blockId!=-1){
	//If the block exists
		if(chunk[blockId[0]].blockList[blockId[1]]!=0){return(1);}
	}
	return(0);//Doesn't exist
}


chunk_fill =function(x,y,data){
	let chunkData = Chunk.fromJson(data);

	
	var point = new Vec3(0,0,0);
	//var point = new Vec3(x*16,0,y*16);
	for(var xx=0; xx<16;xx++){
		for(var yy=0; yy<256;yy++){
			for(var zz=0;zz<16;zz++){
				let block = chunkData.getBlock(point.offset(xx,yy,zz));
				if(block!=null && block.type!=0){
					//console.log(point.offset(xx,yy,zz),block.name);
					block_create(x*16+xx,y*16+zz,-yy,0,block.type);
				}
			}
		}
	}

	
}


block_create = function(x,y,z,dontCull,colSet){
	

	//get Chunk locationd
	var chunkRef = chunk_get(x,y,z);
	var chunkID = return_chunkID(chunkRef[0],chunkRef[1],chunkRef[2]);

	//get relative location in chunk
	var blockLoc = [x - (chunkRef[0]*chunkXY), y - (chunkRef[1]*chunkXY),z - (chunkRef[2]*chunkZ)]


	
	//get index from relative location
	var blockIndex = blockLoc[0]+blockLoc[1]*chunkXY+blockLoc[2]*chunkXY*chunkXY;
	//Generate chunk if it doesn't exists
	
	if(chunk[chunkID]==null){
	chunk_create(chunkRef[0],chunkRef[1],chunkRef[2]);
	}

	
	//If there is not a block at this location
	//if(chunk[chunkID].blockList[blockIndex]==0){
		
		if(colSet!=null){
		
		//Set block to solid
		chunk[chunkID].blockList[blockIndex]=colSet;
		//Set chunk to be redrawn
		chunk[chunkID].chunkreDraw=1;	
		chunk[chunkID].chunkChanged=1;
		}else{
			console.log(chunk[chunkID].blockList[blockIndex]);
		}
		
	//}
}


block_delete = function(x,y,z){
	
	
	
	//get Chunk location
	var chunkRef = chunk_get(x,y,z);
	
	var chunkID = return_chunkID(chunkRef[0],chunkRef[1],chunkRef[2]);
	//get relative location in chunk
	var blockLoc = [x - (chunkRef[0]*chunkXY), y - (chunkRef[1]*chunkXY),z-(chunkRef[2]*chunkZ)]
	//get index from relative location
	var blockIndex = blockLoc[0]+blockLoc[1]*chunkXY+blockLoc[2]*chunkXY*chunkXY;

	if(chunk[chunkID]!=null) {
		//If there is a block 
		if(chunk[chunkID].blockList[blockIndex]!=0){

			//Set block to non-solid
			chunk[chunkID].blockList[blockIndex]=0;
			//redraw chunk
			chunk[chunkID].chunkreDraw=3;	
			chunk[chunkID].chunkChanged=1;
		}
		
	}


}

//3D distance (used for sphere building mainly right now)
function distance( v1, v2 )
{
    var dx = v1[0] - v2[0];
    var dy = v1[1] - v2[1];
    var dz = v1[2] - v2[2];

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

//Takes a byte 0-255 and returns a color 
return_color = function(a){
	var color = [255/2,255/2,255/2];
	switch(a){
			default:
				//console.log(a);
			color = [255/2,255/2,255/2];
			break;
			//Stone
			case 1: color=[100,100,100];
			break;
			//Grass
			case 2: color=[20,200,20];
			break;
			//Dirt
			case 3: color=[151,108,74];
			break;
			//Cobble
			case 4: color=[70,70,70];
			break;
			//Planks
			case 5: color=[212,178,0];
			break;
			//Bedrock
			case 7: color=[25,25,25];
			break;
			//Water
			case 9: color=[4,103,216];
			break;
			case 8: color=[4,103,255];
			break;
			//Lava
			case 10: color=[240,92,0];
			break;
			case 11: color=[250,80,0];
			break;
			//Sand
			case 12: color=[223,209,0];
			break;
			//Gravel
			case 13: color=[120,120,120];
			break;
			//Gold ore
			case 14: color=[247,219,37];
			break;
			//Iron ore
			case 15: color=[100,97,90];
			
			break;
			//Coal Ore
			case 16: color=[90,90,90];
			break;
			//Log
			case 17: color=[81,66,5];
			break;
			//Leaves
			case 18: color=[20,130,0];
			break;
			//Sponge
			case 19: color=[202,243,0];
			break;
			//Lapis ore
			case 21: color=[41,72,146];
			break;
			//Lapis block
			case 22: color=[74,119,225];
			break;
			//Dispenser
			case 23: color=[99,99,99];
			break;
			//Sandstone
			case 24: color=[200,180,0];
			break;
			//Bed
			case 25: color=[216,156,238];
			break;
			//Sticky piston
			case 29: color=[156,238,169];
			break;
			//piston
			case 33: color=[172,125,77];
			break;
			//piston head
			case 34: color=[172,159,77];
			break;
			//wool
			case 35: color=[236,236,236];
			break;
			//gold block
			case 41: color=[255,255,102];
			break;
			//iron block
			case 42: color=[218,218,218];
			break;
			//Double Stone slab
			case 43: color=[120,120,120];
			break;
			//Stone slab
			case 44: color=[120,120,120];
			break;
			//Brick block
			case 45: color=[137,14,14];
			break;
			//TNT
			case 46: color=[255,20,20];
			break;
			//bookshelf
			case 47: color=[142,95,55];
			break;
			//Cobble Mossy
			case 48: color=[70,120,70];
			break;
			//Obsidian
			case 49: color=[40,0,60];
			break;
			//Mob spawner 
			case 52: color=[55,133,142];
			break;
			//oak stairs 
			case 53: color=[212,178,0];
			break;
			//chest 
			case 54: color=[134,117,48];
			break;
			//Diamond ore
			case 56: color=[28,142,123];
			break;
			//Diamond block
			case 57: color=[38,235,202];
			break;
			//Crafting table
			case 58: color=[230,160,0];
			break;
			//Farmland 
			case 60: color=[137,121,58];
			break;
			//Furance
			case 61: color=[65,65,65];
			break;
			//Furance Lit
			case 62: color=[65,65,65];
			break;
			//Wood door 
			case 64: color=[180,150,0];
			break;
			//Ladder
			case 65: color=[180,150,0];
			break;
			//Stone stairs
			case 67: color=[90,90,90];
			break;
			//iron door
			case 71: color=[218,218,218];
			break;
			//redstone ore
			case 73: color=[202,76,76];
			break;
			//redstone ore lit
			case 73: color=[202,76,76];
			break;
			//Snow_layer
			case 78: color=[255,255,255];
			break;
			//Ice
			case 79: color=[0,222,255];
			break;
			//Snow
			case 80: color=[255,255,255];
			break;
			//Cactus
			case 81: color=[13,105,62];
			break;
			//Clay
			case 82: color=[116,120,125];
			break;
			//Jukebox
			case 84: color=[135,88,34];
			break;
			//Fence
			case 85: color=[208,162,110];
			break;
			//Pumpkin
			case 86: color=[255,146,21];
			break;
			//Netherrack
			case 87: color=[120,0,0];
			break;
			//Soul sand
			case 88: color=[41,38,0];
			break;
			//Glowstone
			case 89: color=[242,231,83];
			break;
			//Pumpkin Lit
			case 91: color=[255,146,21];
			break;
			//Cake
			case 92: color=[253,198,256];
			break;
			//Repeater
			case 93: color=[183,19,63];
			break;
			//Repeater
			case 94: color=[232,36,88];
			break;
			//Trap door
			case 96: color=[204,153,51];
			break;
			//Stone brick
			case 98: color=[105,105,105];
			break;
			//Brown Mushroom
			case 99: color=[195,174,77];
			break;
			//Red Mushroom
			case 100: Math.random() < 0.7 ? color=[202,22,27] : color=[255,231,232]; 
			break;
			//Iron bars
			case 101:  color=[190,190,190]; 
			break;
			//Melon blocks
			case 103:  color=[31,124,28]; 
			break;
			//Pumpkin stem
			case 104:  color=[201,162,9]; 
			break;
			//Melon stem
			case 105:  color=[3,82,8]; 
			break;
			//Fence gate
			case 107:  color=[158,119,41]; 
			break;
			//Brick stairs
			case 108: color=[137,14,14];
			break;
			//Stone brick stairs
			case 109: color=[120,120,120];
			break;
			//mycelium
			case 110: color=[193,149,59];
			break;
			//waterlily
			case 111: color=[70,174,77];
			break;
			//Nether brick
			case 112: color=[70,0,0];
			break;
			//Nether brick fence
			case 112: color=[60,0,0];
			break;
			//Nether brick stairs
			case 113: color=[60,0,0];
			break;
			//Enchantment table
			case 116: color=[125,53,144];
			break;
			//Brewing stand
			case 117: color=[165,152,168];
			break;
			//Cauldron
			case 118: color=[100,97,101];
			break;
			//End portal 
			case 119: color=[232,193,242];
			break;
			//End portal frame
			case 120: color=[203,208,140];
			break;
			//End Stone
			case 121: color=[240,249,116];
			break;
			//Redstone lamp
			case 123: color=[135,56,77];
			break;
			//Redstone lamp lit
			case 124: color=[238,59,107];
			break;
			//Wood slab
			case 126: color=[222,198,0];
			break;
			//Sandstone stairs
			case 128: color=[180,160,0];
			break;
			//Emerald ore
			case 129: color=[60,92,68];
			break;
			//E-chest
			case 130: color=[120,0,130];
			break;
			//Emerald Block
			case 133: color=[54,233,96];
			break;
			//Spruce stairs
			case 134: color=[110,48,48];
			break;
			//Birch stairs
			case 135: color=[195,209,141];
			break;
			//Jungle stairs
			case 136: color=[154,81,50];
			break;
			//Beacon
			case 138: color=[96,178,233];
			break;
			//Cobble Wall
			case 139: color=[85,85,85];
			break;
			//Flowerpot
			case 140: color=[107,78,21];
			break;
			//Anvil
			case 145: color=[81,81,81];
			break;
			//chest trapped
			case 146: color=[154,117,48];
			break;
			//redstone block
			case 152: color=[246,40,47];
			break;
			//quartz ore
			case 153: color=[169,87,90];
			break;
			//Hopper
			case 154: color=[134,128,129];
			break;
			//Quartz block
			case 155: color=[229,225,225];
			break;
			//Quartz stairs
			case 156: color=[202,196,197];
			break;
			//Dropper
			case 158: color=[151,152,143];
			break;
			//Stained clay
			case 159: color=[208,113,116];
			break;
			//Leaves2
			case 161: color=[30,80,40];
			break
			//log2
			case 162: color=[125,68,29];
			break
			//acacia stairs
			case 163: color=[198,113,56];
			break
			//dark oak stairs
			case 164: color=[88,53,29];
			break
			//slime
			case 165: color=[104,201,20];
			break
			//iron_trapdoor
			case 167: color=[205,205,205];
			break
			//prismarine
			case 168: color=[62,189,138];
			break
			//sea lantern
			case 169: color=[97,219,170];
			break
			//hay block
			case 170: color=[216,185,61];
			break
			//carpet
			case 171: color=[0,255,0];
			break
			//hardened clay
			case 172: color=[206,123,87];
			break
			//coal block
			case 173: color=[0,0,0];
			break
			//Packed ice
			case 174: color=[0,200,255];
			break;
			//Red standstone
			case 179: color=[232,81,17];
			break;
			//Red standstone stairs
			case 180: color=[200,81,17];
			break;
			//Double Stone slab2
			case 181: color=[200,120,120];
			break;
			//Stone slab 2
			case 182: color=[200,120,120];
			break;
			//Spruce gate
			case 183: color=[110,48,48];
			break;
			//Birch gate
			case 184: color=[195,209,141];
			break;			
			//Jungle gate
			case 185: color=[154,81,50];
			break;			
			//dark oak gate
			case 186: color=[88,53,29];
			break
			//acacia gate
			case 187: color=[198,113,56];
			break
			

			//Spruce fence
			case 188: color=[110,48,48];
			break;
			//Birch fence
			case 189: color=[195,209,141];
			break;			
			//Jungle fence
			case 190: color=[154,81,50];
			break;			
			//dark oak fence
			case 191: color=[88,53,29];
			break
			//acacia fence
			case 192: color=[198,113,56];
			break

	

			//Spruce door
			case 193: color=[120,58,58];
			break;
			//Birch door
			case 194: color=[205,219,151];
			break;			
			//Jungle door
			case 195: color=[164,91,60];
			break;			
			//acacia door
			case 196: color=[208,123,66];
			break
			//dark oak door
			case 197: color=[98,63,39];
			break

		
			//End rod
			case 198: color=[232,201,225];
			break
			
			//Purpur
			case 201: color=[229,155,212];
			break
			//Purpur
			case 202: color=[229,155,212];
			break
			//Purpur
			case 203: color=[229,155,212];
			break
			//Purpur
			case 204: color=[229,155,212];
			break
			//Purpur
			case 205: color=[229,155,212];
			break
						
				
			//End bricks
			case 206: color=[180,160,0];
			break;
			//Grass path 
			case 208: color=[150,130,70];
			break;
			//Ice Frosted
			case 212: color=[0,250,200];
			break;
			//Magma
			case 213: color=[209,106,27];
			break;
			//Nether wart block
			case 214: color=[159,10,10];
			break;
			//red nether brick
			case 215: color=[100,0,0];
			break;
			//bone block
			case 216: color=[250,249,203];
			break;			
			//Observer
			case 218: color=[150,150,150];
			break;
			
			//Shulkers
			case 219: color=[255,255,255];
			break;	
			case 220: color=[232,140,70];
			break;		
			case 221: color=[232,70,226];
			break;		
			case 222: color=[8,230,238];
			break;		
			case 223: color=[256,224,26];
			break;		
			case 224: color=[26,246,58];
			break;		
			case 225: color=[242,185,227];
			break;		
			case 226: color=[102,93,100];
			break;		
			case 227: color=[183,171,180];
			break;					
			case 228: color=[69,135,129];
			break;				
			case 229: color=[120,69,135];
			break;				
			case 230: color=[23,5,185];
			break;				
			case 231: color=[125,73,14];
			break;	
			case 232: color=[30,94,28];
			break;	
			case 233: color=[165,28,33];
			break;	
			case 234: color=[60,53,53];
			break;	
			
			
			case 235: color=[255,255,255];
			break;	
			case 236: color=[232,140,70];
			break;		
			case 237: color=[232,70,226];
			break;		
			case 238: color=[8,230,238];
			break;		
			case 239: color=[256,224,26];
			break;		
			case 240: color=[26,246,58];
			break;		
			case 241: color=[242,185,227];
			break;		
			case 242: color=[102,93,100];
			break;		
			case 243: color=[183,171,180];
			break;					
			case 244: color=[69,135,129];
			break;				
			case 245: color=[120,69,135];
			break;				
			case 246: color=[23,5,185];
			break;				
			case 247: color=[125,73,14];
			break;	
			case 248: color=[30,94,28];
			break;	
			case 249: color=[165,28,33];
			break;	
			case 250: color=[60,53,53];
			break;	
			
			//Concrete
			case 251: color=[170,170,170];
			break;
			//Concrete Powder
			case 252: color=[170,170,170];
			break;
			
		
	}
	return color;
}

//Greedy meshing

var mask = new Int32Array(4096);
greedy = function(chunkID,chunkPos) {
	var volume=chunk[chunkID].blockList;
	if(volume==undefined){
		console.log(chunkID);
		console.log(chunk[chunkID]);
	}
	var dims=[chunkXY,chunkXY,chunkZ];
  function f(i,j,k) {
    return volume[i + dims[0] * (j + dims[1] * k)];
  }
  //Sweep over 3-axes
  var vertices = [], faces = [];
  for(var d=0; d<3; ++d) {
	  
    var i, j, k, l, w, h
      , u = (d+1)%3
      , v = (d+2)%3
      , x = [0,0,0]
      , q = [0,0,0];
    if(mask.length < dims[u] * dims[v]) {
      mask = new Int32Array(dims[u] * dims[v]);
    }
    q[d] = 1;
	
	//For each slice in this chunk
    for(x[d]=-1; x[d]<dims[d]; ) {
      //Compute mask
      var n = 0;
	  
	  //Loop through first axis 
      for(x[v]=0; x[v]<dims[v]; ++x[v])
		//Loop through second axis
      for(x[u]=0; x[u]<dims[u]; ++x[u], ++n) {
			//To get the direction, you use d, then you use q to determine which way it is facing
			//You can then use that to determine face value 
			
			//A is the first block we are checking
        var a = (0    <= x[d]      ? f(x[0],      x[1],      x[2])      : 0 )
			//B is the second block we are checking
          , b = (x[d] <  dims[d]-1 ? f(x[0]+q[0], x[1]+q[1], x[2]+q[2]) : 0);
		  

		  //If they are the same, or are both 0  (because if they are the same, there isn't a face between)
        if((!!a) === (!!b)) {
          mask[n] = 0;
		  //If a exists, but b doesn't 
        } else if(!!a) {
          mask[n] = a;
		  //If b exists but a doesn't
        } else {
          mask[n] = -b;
        }
      }
      //Increment x[d]
      ++x[d];
      //Generate mesh for mask using lexicographic ordering
      n = 0;
      for(j=0; j<dims[v]; ++j)
      for(i=0; i<dims[u]; ) {
        var c = mask[n];
		/*if(c==-1 || c==1){
			c=0;
		}*/
        if(!!c) {
          //Compute width
          for(w=1; c === mask[n+w] && i+w<dims[u]; ++w) {
          }
          //Compute height (this is slightly awkward
          var done = false;
          for(h=1; j+h<dims[v]; ++h) {
            for(k=0; k<w; ++k) {
              if(c !== mask[n+k+h*dims[u]]) {
                done = true;
                break;
              }
            }
            if(done) {
              break;
            }
          }
          //Add quad
          x[u] = i;  x[v] = j;
          var du = [0,0,0]
            , dv = [0,0,0]; 
          if(c > 0) {
            dv[v] = h;
            du[u] = w;
          } else {
            c = -c;
            du[v] = h;
            dv[u] = w;
          }
		  
		var col = return_color(c);  

		switch(d){
			case 0:
			if(c>0){
				col=[col[0]*0.9,col[1]*0.9,col[2]*0.9];		
			}else{
				col=[col[0]*0.8,col[1]*0.8,col[2]*0.8];					
			}	
			break;
			case 1:
			if(c>0){
				col=[col[0]*0.7,col[1]*0.7,col[2]*0.7];		
			}else{
				col=[col[0]*0.6,col[1]*0.6,col[2]*0.6];			
			}			
			break;
			case 2:
			if(c<=0){
				//bottom
				col=[col[0]*0.5,col[1]*0.5,col[2]*0.5];
			}
				//top
								
			
			break;
		}
		  
          vertices.push(x[0]+chunkPos[0],             x[1]+chunkPos[1],             x[2]   +chunkPos[2]         );
          vertices.push(x[0]+du[0]+chunkPos[0],       x[1]+du[1]+chunkPos[1],       x[2]+du[2]+chunkPos[2]      );
          vertices.push(x[0]+du[0]+dv[0]+chunkPos[0], x[1]+du[1]+dv[1]+chunkPos[1], x[2]+du[2]+dv[2]+chunkPos[2]);
          vertices.push(x[0]      +dv[0]+chunkPos[0], x[1]      +dv[1]+chunkPos[1], x[2]      +dv[2]+chunkPos[2]);

          faces.push(col[0],col[1],col[2],col[0],col[1],col[2],col[0],col[1],col[2],col[0],col[1],col[2],);
          //Zero-out mask
          for(l=0; l<h; ++l)
          for(k=0; k<w; ++k) {
            mask[n+k+l*dims[u]] = 0;
          }
          //Increment counters and continue
          i += w; n += w;
        } else {
          ++i;    ++n;
        }
      }
    }
  }
  return([ new Int32Array(vertices), new Uint8Array(faces) ]);
}


chunk_get =function(x,y,z){
	return([Math.floor(x/chunkXY),Math.floor(y/chunkXY),Math.floor(z/chunkZ)]);
}


//Sets a chunk drawing data if needed
draw_chunk =function(chunkID){
	
	//Mark chunk as not needing a redraw
	chunk[chunkID].chunkreDraw=0;
	//Get chunk position to displace blocks with inside of the meth
	var chunkPos = [(chunk[chunkID].coords[0]*chunkXY),(chunk[chunkID].coords[1]*chunkXY),(chunk[chunkID].coords[2]*chunkZ)];
	//Mesh the blocklist 
	var get = greedy(chunkID,chunkPos);;
	
	if(chunk[chunkID].sendList==1){
		//Add draw data to send list
		sendList.push({
			coords: [chunk[chunkID].coords[0],chunk[chunkID].coords[1],chunk[chunkID].coords[2]],
			position : get[0],
			color : get[1],
			blockList : chunk[chunkID].blockList,
		});;
		
	}else{
		sendList.push({
			coords: [chunk[chunkID].coords[0],chunk[chunkID].coords[1],chunk[chunkID].coords[2]],
			position : get[0],
			color : get[1],
		});;		
		chunk[chunkID].sendList=1;
	}
	
	chunk[chunkID].drawLength = get[0].length;
}


//Messaging from main thread
self.addEventListener('message', function(e) {
	var message = e.data;
	
	switch(message.id){
		case "chunk":
			chunk_fill(message.coordX,message.coordY,message.data);
		break;
		case "chunk_receive":
		var chunkID=return_chunkID(message.coords[0],message.coords[1],message.coords[2]);
		chunk_create(message.coords[0],message.coords[1],message.coords[2]);
		chunk[chunkID].blockList=message.blockList;
		chunk[chunkID].chunkreDraw=1;
		chunk[chunkID].sendList = 0;
		/*
		//draw_chunk(chunkID);
		
		self.postMessage({
		id : "meshUpdate",
		});*/
		break;
		//Big delete cube radius
		case "bigDelete":
		cam = message.cam;
		var blockDel = message.blockDel;
		for(var xx=-blockDel;xx<=blockDel;xx++){
			for(var yy=-blockDel;yy<=blockDel;yy++){
				for(var zz=-blockDel;zz<=blockDel;zz++){
					block_delete(Math.round(cam[0]+xx),Math.round(cam[1]+yy),Math.round(cam[2]+1+zz));
				}
			}
		}
		break;
		
		//Big sphere 
		case "bigSphere":
		var blockBuild=Math.round(message.blockBuild*0.5);
		cam = message.cam;
		color=3;
		for(var xx=-blockBuild;xx<=blockBuild;xx++){
		for(var yy=-blockBuild;yy<=blockBuild;yy++){
		for(var zz=-blockBuild;zz<=blockBuild;zz++){
			var dist=distance([0,0,0],[xx,yy,zz]);
			if(dist<blockBuild){
				
				if(dist>=blockBuild-1){
				block_create(Math.round(cam[0]+xx),Math.round(cam[1]+yy),Math.round(cam[2]+zz),0);
				}else{
				block_create(Math.round(cam[0]+xx),Math.round(cam[1]+yy),Math.round(cam[2]+zz),1);				
				}
			}
		}}}
		break;
		
		//Big cube
		case "bigBlock":
		var blockBuild = message.blockBuild;
		cam = message.cam;
		//For x & y out to the blockBuild variable, and a Z to the ground making a giant cube
		for(var xx=-blockBuild;xx<=blockBuild;xx++){
			for(var yy=-blockBuild;yy<=blockBuild;yy++){
				for(var zz=0;zz<=blockBuild;zz++){
				
				if(zz!=0){
					color=2;
				}else{
					color=5;
				}
				//If the block is at the edge of the cube, it needs to be culled checked.
				if(Math.abs(xx)>=blockBuild || Math.abs(yy)>=blockBuild || zz<=0 || zz>=(blockBuild-1)){
					block_create(Math.round(cam[0]+xx),Math.round(cam[1]+yy),Math.round(cam[2]+zz),0);
				}else{
				//If the block is not at the edge, it doesn't need to be culled check because it is certaintly covered.
					block_create(Math.round(cam[0]+xx),Math.round(cam[1]+yy),Math.round(cam[2]+zz),1);					
				}
			}
			}
		}
		break;


		//Init for when receiving chunk data (size of chunks, view distance)
		case "start":
		console.table([message]);
		chunkXY = message.chunkXY;
		chunkZ = message.chunkZ;
		viewDist = message.viewDist;
		zView = message.zView;
		xx=-viewDist;
		yy=-viewDist;
		camChunk = [0,0,0];
		
		//Generate lists with new chunk info
		for(var zz=0;zz<chunkZ;zz++){
			for(var yy=0;yy<chunkXY;yy++){
				for(var xx=0;xx<chunkXY;xx++){
					chunkInd.push([xx,yy,zz]);
					chunkList.push(-1);
				}
			}
		}
		
		//Create empty list for each blok in a chunk
		blockLen =chunkList.length;
		chunkList = new Uint8Array(blockLen);
		chunkList.fill(0);
		
		//Flag start as 1 to start the culling 
		start=1;
		
		break;

		
		
		//Receive block create buffer
		case "block_create":
			block_create(message.coords[0],message.coords[2],-message.coords[1],message.dontCull,message.color);
		break;
		
		//Receive delete block  buffer
		case "block_delete":
		block_delete(message.coords[0],message.coords[1],message.coords[2]);
		break;
		
		//Camera update interval
		case "camera":
		cam = message.cam;
		viewDist = message.viewDist*10.0;
		zView = message.zView*10.0;
		break;		
	}
});




//The actual culling process
var cullProc =function(){
	//If we have init already
	if(start==1){
	/*
		 ___  __  __  __    __    ____  _  _  ___ 
		 / __)(  )(  )(  )  (  )  (_  _)( \( )/ __)
		( (__  )(__)(  )(__  )(__  _)(_  )  (( (_-.
		 \___)(______)(____)(____)(____)(_)\_)\___/
	*/

		var timeMod=0;
		//Get chunk at camera
		camChunk = chunk_get(cam[0],cam[1],cam[2]);
			
		var chunkCullList=[];
		for(var xx=-7;xx<=7;xx++){
		for(var yy=-7;yy<=7;yy++){
		for(var zz=-2;zz<=2;zz++){
			var chunkID = return_chunkID(camChunk[0]+xx,camChunk[1]+yy,camChunk[2]+zz);
			if(chunk[chunkID]!=null){	
			
				var chunkRef=chunk[chunkID];
				chunkCullList.push([chunkID,distance(chunkRef.coords,camChunk)]);
			}
		}
		}
		}
		chunkCullList.sort(function(a,b){
			return(a[1]-b[1]);
		});
		var chunkIndex=0;
		
		var going=255;
		if(chunkCullList.length==0){
			going=0;
		}
		
		while(going>0){

			var hitter=0;
			//Get chunk at our current displacement 
			var chunkID = chunkCullList[chunkIndex][0];
			//If the chunk we are working at is defined
			if(chunk[chunkID]!=null){
				var chunkRef = chunk[chunkID];
				//If it needs to be redrawn, redraw it
				if(chunkRef.chunkreDraw>0){
						
						draw_chunk(chunkID);
						hitter=1;
						
				}
			}
			if(hitter==1){
				going=0;
			}
			chunkIndex+=1;
			if(chunkIndex>=chunkCullList.length){
				going=0;
			}
			going--;
		}
			//Loop through chunks in area

	}


	if(sendList.length>0){

		//Send single chunk data at a time

		/*var sender=[];
		sender.push(sendList.shift());
		self.postMessage({
			
			id : 'drawData',
			sendList : sender,
		});*/

		//Send all chunk data at once
		self.postMessage({
			id : "drawData",
			sendList : sendList,
		});
		sendList=[];
	}

}

cullTimer = function(amount){
	setTimeout(function(){
		var cullAmount = cullProc();
		if(cullAmount<500){
			cullAmount=500
		}
		cullTimer(5);
	},60);
}


cullTimer(100);



