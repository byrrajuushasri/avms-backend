warning: in the working copy of 'src/matrimonial-users/matrimonial-users.service.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/matrimonial-users/matrimonial-users.service.ts b/src/matrimonial-users/matrimonial-users.service.ts[m
[1mindex be98f59..375504b 100644[m
[1m--- a/src/matrimonial-users/matrimonial-users.service.ts[m
[1m+++ b/src/matrimonial-users/matrimonial-users.service.ts[m
[36m@@ -49,44 +49,25 @@[m [mexport class MatrimonialUsersService {[m
 [m
  [m
   async checkMember(data: any) {[m
[31m-    console.log([m
[31m-      '========== CHECK MEMBER BEFORE MATRIMONIAL ==========',[m
[31m-    );[m
[31m-[m
[31m-    // Normalize input: 7997587834, +917997587834,[m
[31m-    // or 91-7997587834 will all become 7997587834.[m
[31m-    const mobileInput =[m
[31m-      data?.mobile !== undefined && data?.mobile !== null[m
[32m+[m[32m    const mobile =[m
[32m+[m[32m      data?.mobile != null[m
         ? String(data.mobile).trim()[m
         : '';[m
 [m
[31m-    const normalizedMobile =[m
[31m-      mobileInput.replace(/\D/g, '').slice(-10);[m
[31m-[m
[31m-    console.log('Entered mobile:', mobileInput);[m
[31m-    console.log('Normalized mobile:', normalizedMobile);[m
[31m-[m
[31m-    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {[m
[32m+[m[32m    if (!mobile) {[m
       return {[m
         success: false,[m
         canRegister: false,[m
[31m-        message: 'Please enter a valid 10-digit Mobile Number.',[m
[32m+[m[32m        message: 'Please enter a valid Mobile Number.',[m
       };[m
     }[m
 [m
[31m-    // Search membership using the last 10 digits,[m
[31m-    // regardless of country code or formatting in the database.[m
[31m-    const member = await this.memberRepository[m
[31m-      .createQueryBuilder('member')[m
[31m-      .where([m
[31m-        "RIGHT(REGEXP_REPLACE(member.mobile, '[^0-9]', ''), 10) = :mobile",[m
[31m-        { mobile: normalizedMobile },[m
[31m-      )[m
[31m-      .getOne();[m
[32m+[m[32m    // Find membership using mobile number[m
[32m+[m[32m    const member = await this.memberRepository.findOne({[m
[32m+[m[32m      where: { mobile },[m
[32m+[m[32m    });[m
 [m
     if (!member) {[m
[31m-      console.log('Membership not found for:', normalizedMobile);[m
[31m-[m
       return {[m
         success: false,[m
         canRegister: false,[m
[36m@@ -95,1892 +76,39 @@[m [mexport class MatrimonialUsersService {[m
       };[m
     }[m
 [m
[31m-    console.log('Member found:', member.member_id);[m
[31m-    console.log('Member mobile:', member.mobile);[m
[31m-[m
[31m-    // Check whether this member already has a matrimonial profile.[m
[31m-    const existingMatrimonial =[m
[31m-      await this.userRepository.findOne({[m
[31m-        where: {[m
[31m-          member_id: member.member_id,[m
[31m-        },[m
[31m-      });[m
[32m+[m[32m    // Prevent duplicate matrimonial registration[m
[32m+[m[32m    const existingProfile = await this.userRepository.findOne({[m
[32m+[m[32m      where: { mobile },[m
[32m+[m[32m    });[m
 [m
[31m-    if (existingMatrimonial) {[m
[32m+[m[32m    if (existingProfile) {[m
       return {[m
         success: false,[m
         canRegister: false,[m
[31m-        alreadyRegistered: true,[m
[31m-        message: 'This Member is already registered in Matrimonial.',[m
[31m-        data: {[m
[31m-          member_id: member.member_id,[m
[31m-          matrimonial_id: existingMatrimonial.id,[m
[31m-          full_name: member.full_name,[m
[31m-          father_name: member.father_name || null,[m
[31m-          mobile: member.mobile,[m
[31m-          email: member.email,[m
[31m-          gender: member.gender,[m
[31m-          occupation: member.occupation,[m
[31m-          date_of_birth: member.date_of_birth,[m
[31m-          photo: member.photo,[m
[31m-          status: existingMatrimonial.status,[m
[31m-          approved_at: existingMatrimonial.approved_at,[m
[31m-          expiry_date: existingMatrimonial.expiry_date,[m
[31m-        },[m
[32m+[m[32m        message: 'You have already registered for Matrimonial.',[m
       };[m
     }[m
 [m
     return {[m
       success: true,[m
       canRegister: true,[m
[31m-      alreadyRegistered: false,[m
[31m-      message:[m
[31m-        'Member verified. You can now complete the Matrimonial form.',[m
[32m+[m[32m      message: 'Membership verified successfully. You can register for Matrimonial.',[m
       data: {[m
[31m-        member_id: member.member_id,[m
[31m-        full_name: member.full_name,[m
[31m-        father_name: member.father_name || null,[m
[31m-        mobile: member.mobile,[m
[31m-        email: member.email,[m
[31m-        gender: member.gender,[m
[31m-        occupation: member.occupation,[m
[31m-        date_of_birth: member.date_of_birth,[m
[31m-        photo: member.photo,[m
[32m+[m[32m        full_name: member.full_name ?? null,[m
[32m+[m[32m        name: member.full_name ?? null,[m
[32m+[m[32m        mobile: member.mobile ?? null,[m
[32m+[m[32m        email: member.email ?? null,[m
[32m+[m[32m        gender: member.gender ?? null,[m
[32m+[m[32m        occupation: member.occupation ?? null,[m
[32m+[m[32m        date_of_birth: member.date_of_birth ?? null,[m
[32m+[m[32m        photo: member.photo ?? null,[m
[32m+[m[32m        district: member.district ?? null,[m
[32m+[m[32m        mandal: member.mandal ?? null,[m
[32m+[m[32m        sangham: member.sangham ?? null,[m
       },[m
     };[m
   }[m
 [m
[31m-  // =========================================================[m
[31m-  // REGISTER MATRIMONIAL MEMBER[m
[31m-  // =========================================================[m
[31m-[m
[31m-  async register([m
[31m-    data: any,[m
[31m-    photo?: Express.Multer.File,[m
[31m-  ) {[m
[31m-[m
[31m-    console.log([m
[31m-      '========== MATRIMONIAL REGISTER ==========',[m
[31m-    );[m
[31m-[m
[31m-    console.log([m
[31m-      'Received matrimonial data:',[m
[31m-      data,[m
[31m-    );[m
[31m-[m
[31m-    console.log([m
[31m-      'Received photo:',[m
[31m-      photo?.filename || 'No photo',[m
[31m-    );[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // MEMBER ID[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    const memberId =[m
[31m-      data?.member_id[m
[31m-        ? String(data.member_id).trim()[m
[31m-        : '';[m
[31m-[m
[31m-[m
[31m-    if (!memberId) {[m
[31m-[m
[31m-      return {[m
[31m-        success: false,[m
[31m-        canRegister: false,[m
[31m-        message:[m
[31m-          'Membership verification is required.',[m
[31m-      };[m
[31m-    }[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // FIND MEMBER[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    const member =[m
[31m-      await this.memberRepository.findOne({[m
[31m-        where: {[m
[31m-          member_id: memberId,[m
[31m-        },[m
[31m-      });[m
[31m-[m
[31m-[m
[31m-    if (!member) {[m
[31m-[m
[31m-      return {[m
[31m-        success: false,[m
[31m-        canRegister: false,[m
[31m-        message:[m
[31m-          'Membership record not found. Please verify your membership again.',[m
[31m-      };[m
[31m-    }[m
[31m-[m
[31m-[m
[31m-    console.log([m
[31m-      'Verified Membership:',[m
[31m-      member.member_id,[m
[31m-    );[m
[31m-[m
[31m-    console.log([m
[31m-      'Member Name:',[m
[31m-      member.full_name,[m
[31m-    );[m
[31m-[m
[31m-    console.log([m
[31m-      'Member Mobile:',[m
[31m-      member.mobile,[m
[31m-    );[m
[31m-[m
[31m-    console.log([m
[31m-      'Member Email:',[m
[31m-      member.email,[m
[31m-    );[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // CHECK EXISTING MATRIMONIAL[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    const existingUser =[m
[31m-      await this.userRepository.findOne({[m
[31m-        where: {[m
[31m-          member_id: member.member_id,[m
[31m-        },[m
[31m-      });[m
[31m-[m
[31m-[m
[31m-    if (existingUser) {[m
[31m-[m
[31m-      return {[m
[31m-[m
[31m-        success: false,[m
[31m-[m
[31m-        canRegister: false,[m
[31m-[m
[31m-        alreadyRegistered: true,[m
[31m-[m
[31m-        message:[m
[31m-          'This Member is already registered in Matrimonial.',[m
[31m-[m
[31m-        data: {[m
[31m-[m
[31m-          id:[m
[31m-            existingUser.id,[m
[31m-[m
[31m-          member_id:[m
[31m-            member.member_id,[m
[31m-[m
[31m-          full_name:[m
[31m-            member.full_name,[m
[31m-[m
[31m-          mobile:[m
[31m-            member.mobile,[m
[31m-[m
[31m-          email:[m
[31m-            member.email,[m
[31m-[m
[31m-          gender:[m
[31m-            member.gender,[m
[31m-[m
[31m-          occupation:[m
[31m-            member.occupation,[m
[31m-[m
[31m-          date_of_birth:[m
[31m-            member.date_of_birth,[m
[31m-[m
[31m-          photo:[m
[31m-            member.photo,[m
[31m-[m
[31m-          status:[m
[31m-            existingUser.status,[m
[31m-        },[m
[31m-      };[m
[31m-    }[m
[31m-[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // CREATE MATRIMONIAL USER[m
[31m-    // =======================================================[m
[31m-[m
[31m-    const user =[m
[31m-      new MatrimonialUser();[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // MEMBER ID[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.member_id =[m
[31m-      member.member_id;[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // PROFILE CATEGORY[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.profile_category =[m
[31m-      data?.profile_category || null;[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // FAMILY DETAILS[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.father_name =[m
[31m-      data?.father_name || null;[m
[31m-[m
[31m-    user.mother_name =[m
[31m-      data?.mother_name || null;[m
[31m-[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // FATHER OCCUPATION[m
[31m-    // =======================================================[m
[31m-[m
[31m-    user.father_occupation =[m
[31m-      data?.father_occupation[m
[31m-        ? String([m
[31m-            data.father_occupation,[m
[31m-          ).trim()[m
[31m-        : null;[m
[31m-[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // MOTHER OCCUPATION[m
[31m-    // =======================================================[m
[31m-[m
[31m-    user.mother_occupation =[m
[31m-      data?.mother_occupation[m
[31m-        ? String([m
[31m-            data.mother_occupation,[m
[31m-          ).trim()[m
[31m-        : null;[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // GOTRAM[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.father_gotram =[m
[31m-      data?.father_gotram || null;[m
[31m-[m
[31m-    user.mother_gotram =[m
[31m-      data?.mother_gotram || null;[m
[31m-[m
[31m-    user.grandmother_gotram =[m
[31m-      data?.grandmother_gotram || null;[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // NAKSHATRAM[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.nakshatram =[m
[31m-      data?.nakshatram || null;[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // PADHAM[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    if ([m
[31m-      data?.padham === '' ||[m
[31m-      data?.padham === null ||[m
[31m-      data?.padham === undefined[m
[31m-    ) {[m
[31m-[m
[31m-      user.padham = null;[m
[31m-[m
[31m-    } else {[m
[31m-[m
[31m-      const padhamNumber =[m
[31m-        Number(data.padham);[m
[31m-[m
[31m-      user.padham =[m
[31m-        Number.isNaN(padhamNumber)[m
[31m-          ? null[m
[31m-          : padhamNumber;[m
[31m-    }[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // RASI[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.rasi =[m
[31m-      data?.rasi || null;[m
[31m-[m
[31m-[m
[31m-    // -------------------------------------------------------[m
[31m-    // PERSONAL DETAILS[m
[31m-    // -------------------------------------------------------[m
[31m-[m
[31m-    user.color =[m
[31m-      data?.color || null;[m
[31m-[m
[31m-    user.height =[m
[31m-      data?.height || null;[m
[31m-[m
[31m-    user.education =[m
[31m-      data?.education || null;[m
[31m-[m
[31m-    user.annual_income =[m
[31m-      data?.annual_income || null;[m
[31m-[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // MARITAL STATUS[m
[31m-    // =======================================================[m
[31m-[m
[31m-    const maritalStatus = data?.marital_status[m
[31m-      ? String(data.marital_status).trim()[m
[31m-      : 'Never Married';[m
[31m-[m
[31m-    user.marital_status = maritalStatus;[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // NUMBER OF CHILDREN[m
[31m-    // =======================================================[m
[31m-[m
[31m-    const childrenValue = data?.number_of_children;[m
[31m-[m
[31m-    if ([m
[31m-      maritalStatus === 'Divorced' ||[m
[31m-      maritalStatus === 'Awaiting Divorce'[m
[31m-    ) {[m
[31m-      const children = Number(childrenValue);[m
[31m-[m
[31m-      user.number_of_children =[m
[31m-        childrenValue !== '' &&[m
[31m-        childrenValue !== null &&[m
[31m-        childrenValue !== undefined &&[m
[31m-        Number.isInteger(children) &&[m
[31m-        children >= 0[m
[31m-          ? children[m
[31m-          : 0;[m
[31m-    } else {[m
[31m-      user.number_of_children = 0;[m
[31m-    }[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // PREVIOUS MARRIAGE CONDITIONS[m
[31m-    // =======================================================[m
[31m-[m
[31m-    user.previous_marriage_conditions =[m
[31m-      maritalStatus === 'Divorced' ||[m
[31m-      maritalStatus === 'Awaiting Divorce'[m
[31m-        ? data?.previous_marriage_conditions[m
[31m-          ? String(data.previous_marriage_conditions).trim()[m
[31m-          : null[m
[31m-        : null;[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // PHYSICAL STATUS[m
[31m-    // =======================================================[m
[31m-[m
[31m-    user.physical_status = data?.physical_status[m
[31m-      ? String(data.physical_status).trim()[m
[31m-      : 'Normal';[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // FAMILY STATUS[m
[31m-    // =======================================================[m
[31m-[m
[31m-    user.family_status = data?.family_status[m
[31m-      ? String(data.family_status).trim()[m
[31m-      : null;[m
[31m-[m
[31m-    // =======================================================[m
[31m-    // ADDITIONAL DETAILS[m
[