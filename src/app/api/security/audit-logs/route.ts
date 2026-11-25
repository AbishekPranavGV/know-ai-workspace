import { NextResponse, connection } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  await connection()
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    })

    const formattedLogins = logs.map((log) => ({
      id: log.id,
      time: log.timestamp.toISOString().replace("T", " ").substring(0, 16),
      device: log.deviceInfo || "Web Browser",
      ip: log.ipAddress || "127.0.0.1",
      location: log.location || "Localhost",
      status: log.outcome,
      eventType: log.eventType,
    }))

    const formattedAlerts = logs.map((log) => {
      let message = ""
      if (log.eventType === "SEC-001") message = `Successful login on ${log.deviceInfo || "device"}`
      else if (log.eventType === "SEC-002") message = `Failed login attempt from ${log.ipAddress || "unknown IP"}`
      else if (log.eventType === "SEC-004") message = "Account password updated successfully"
      else if (log.eventType === "SEC-005") message = "MFA configuration modified"
      else if (log.eventType === "SEC-008") message = `Active session revoked on ${log.deviceInfo || "device"}`
      else message = `Security event ${log.eventType} recorded`

      return {
        id: log.id,
        severity: log.securityClassification || "INFO",
        message,
        time: log.timestamp.toISOString().replace("T", " ").substring(0, 16),
      }
    })

    return NextResponse.json({
      success: true,
      logins: formattedLogins,
      alerts: formattedAlerts,
    })
  } catch (error) {
    console.error("GET /api/security/audit-logs error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
