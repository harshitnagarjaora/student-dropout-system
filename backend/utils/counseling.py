# backend/utils/counseling.py
"""
AI Counseling message generator based on student risk factors
"""

def generate_counseling_message(risk_level, attendance, marks, fees_pending, failed_subjects):
    """
    Generate personalized counseling message based on student's risk factors
    
    Args:
        risk_level: Predicted risk level (Low/Medium/High)
        attendance: Attendance percentage
        marks: Average marks
        fees_pending: Amount of pending fees
        failed_subjects: Number of failed subjects
    
    Returns:
        str: Personalized counseling message
    """
    messages = []
    
    # 1. Header message based on overall risk level
    if risk_level == "High":
        messages.append(
            "⚠️ IMMEDIATE ATTENTION REQUIRED\n"
            "Your academic performance indicates high dropout risk. "
            "Please take urgent action to improve your situation."
        )
    elif risk_level == "Medium":
        messages.append(
            "⚡ CAUTION ADVISED\n"
            "You're showing early warning signs of academic struggle. "
            "Let's work together to get you back on track."
        )
    else:
        messages.append(
            "✅ GOOD PROGRESS\n"
            "You're doing well! Here are some tips to maintain and improve your performance."
        )
    
    # 2. Attendance-specific counseling
    if attendance < 60:
        messages.append(
            f"\n🔴 CRITICAL ATTENDANCE ({attendance:.1f}%)\n"
            "• You're at serious risk of being detained\n"
            "• Attend ALL remaining classes without fail\n"
            "• Meet your HOD immediately to discuss your situation\n"
            "• Consider medical certificate if you have health issues"
        )
    elif attendance < 75:
        messages.append(
            f"\n🟡 LOW ATTENDANCE ({attendance:.1f}%)\n"
            "• Minimum 75% attendance required for exams\n"
            "• Missing more classes will affect your eligibility\n"
            "• Set daily alarms and maintain a routine\n"
            "• Find a study partner for accountability"
        )
    elif attendance < 85:
        messages.append(
            f"\n🟢 Good attendance ({attendance:.1f}%)\n"
            "• Maintain this consistency\n"
            "• Aim for above 85% for better opportunities"
        )
    else:
        messages.append(
            f"\n🌟 Excellent attendance ({attendance:.1f}%)\n"
            "• Keep up the great work!\n"
            "• Help peers who struggle with attendance"
        )
    
    # 3. Academic performance counseling
    if marks < 35:
        messages.append(
            f"\n🔴 POOR ACADEMIC PERFORMANCE ({marks:.1f})\n"
            "• You're failing in multiple subjects - immediate action needed\n"
            "• Schedule meetings with all subject teachers THIS WEEK\n"
            "• Join remedial classes or tutoring immediately\n"
            "• Form study groups with performing students\n"
            "• Dedicate minimum 4 hours daily for self-study"
        )
    elif marks < 50:
        messages.append(
            f"\n🟡 BELOW AVERAGE MARKS ({marks:.1f})\n"
            "• Focus on your weak subjects first\n"
            "• Create a daily study schedule (2-3 hours minimum)\n"
            "• Solve previous year question papers\n"
            "• Seek help from teachers during office hours\n"
            "• Use online resources (YouTube, NPTEL) for difficult topics"
        )
    elif marks < 70:
        messages.append(
            f"\n🟢 Average performance ({marks:.1f})\n"
            "• You have potential to score higher\n"
            "• Focus on conceptual clarity\n"
            "• Attempt mock tests regularly\n"
            "• Aim for distinction (>75%)"
        )
    else:
        messages.append(
            f"\n🌟 Excellent marks ({marks:.1f})\n"
            "• Outstanding performance!\n"
            "• Consider helping struggling peers\n"
            "• Explore advanced topics and research\n"
            "• Apply for scholarships and competitions"
        )
    
    # 4. Failed subjects counseling
    if failed_subjects > 3:
        messages.append(
            f"\n🔴 MULTIPLE BACKLOGS ({failed_subjects} subjects)\n"
            "• Clear backlogs immediately - they compound quickly\n"
            "• Meet academic coordinator for a recovery plan\n"
            "• Consider repeating the year if necessary\n"
            "• Don't take new subjects until you clear backlogs"
        )
    elif failed_subjects > 0:
        messages.append(
            f"\n⚠️ BACKLOGS ({failed_subjects} subject{'s' if failed_subjects > 1 else ''})\n"
            "• Clear these in the next supplementary exams\n"
            "• Allocate extra study time for these subjects\n"
            "• Get notes from toppers of those subjects"
        )
    
    # 5. Fees counseling
    if fees_pending > 0:
        messages.append(
            f"\n💰 PENDING FEES (₹{fees_pending:,.0f})\n"
            "• Clear dues to avoid examination hold\n"
            "• Apply for scholarships if facing financial issues\n"
            "• Discuss payment plans with accounts office\n"
            "• Check for fee waivers based on merit/need"
        )
    
    # 6. Actionable recommendations based on risk level
    messages.append("\n📋 IMMEDIATE ACTION ITEMS:")
    
    if risk_level == "High":
        messages.append(
            "1. Meet your class advisor TODAY\n"
            "2. Create study schedule with teacher guidance\n"
            "3. Join academic support groups immediately\n"
            "4. Consider counseling services if stressed\n"
            "5. Inform parents about your situation"
        )
    elif risk_level == "Medium":
        messages.append(
            "1. Set weekly goals and track progress\n"
            "2. Increase study hours by 1-2 hours daily\n"
            "3. Join study groups for difficult subjects\n"
            "4. Regular meetings with mentors\n"
            "5. Improve time management skills"
        )
    else:
        messages.append(
            "1. Maintain your current routine\n"
            "2. Explore internship opportunities\n"
            "3. Participate in technical competitions\n"
            "4. Build your professional network\n"
            "5. Help and mentor struggling peers"
        )
    
    # 7. Resources and support
    messages.append(
        "\n📚 SUPPORT RESOURCES AVAILABLE:\n"
        "• Library: Extra books and study materials\n"
        "• Tutoring Center: Free tutoring Mon-Fri 4-6 PM\n"
        "• Counseling: Student wellness center (confidential)\n"
        "• Online: NPTEL, Coursera (free with student email)\n"
        "• Peer Groups: Join department WhatsApp groups"
    )
    
    # 8. Emergency contacts
    messages.append(
        "\n📞 IMPORTANT CONTACTS:\n"
        "• Academic Counselor: counselor@college.edu\n"
        "• HOD Office: hod.dept@college.edu\n"
        "• Student Helpline: 1800-XXX-XXXX\n"
        "• Emergency Support: Available 24/7"
    )
    
    # 9. Motivational closing
    if risk_level == "High":
        messages.append(
            "\n💪 Remember: It's never too late to turn things around! "
            "Many successful people struggled in college. "
            "Take action NOW and you can still succeed!"
        )
    elif risk_level == "Medium":
        messages.append(
            "\n💪 You're capable of much more! "
            "Small improvements daily lead to big results. "
            "Stay focused and consistent!"
        )
    else:
        messages.append(
            "\n🌟 Keep up the excellent work! "
            "You're on the path to success. "
            "Your future is bright!"
        )
    
    return "\n".join(messages)

def get_risk_reasons(attendance, marks, fees_pending, failed_subjects):
    """
    Generate list of risk reasons based on student metrics
    
    Args:
        attendance: Attendance percentage
        marks: Average marks  
        fees_pending: Amount of pending fees
        failed_subjects: Number of failed subjects
    
    Returns:
        list: List of risk reasons
    """
    reasons = []
    
    if attendance < 60:
        reasons.append("Critical attendance")
    elif attendance < 75:
        reasons.append("Low attendance")
    
    if marks < 35:
        reasons.append("Failing grades")
    elif marks < 50:
        reasons.append("Poor academic performance")
    
    if failed_subjects > 2:
        reasons.append("Multiple backlogs")
    elif failed_subjects > 0:
        reasons.append(f"{failed_subjects} failed subject{'s' if failed_subjects > 1 else ''}")
    
    if fees_pending > 0:
        reasons.append("Pending fees")
    
    return reasons if reasons else ["No specific concerns"]