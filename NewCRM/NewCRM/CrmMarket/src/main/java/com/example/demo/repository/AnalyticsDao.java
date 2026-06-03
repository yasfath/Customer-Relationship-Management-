package com.example.demo.repository;

import com.example.demo.dto.CampaignStatusDTO;
import com.example.demo.dto.LeadFunnelDTO;
import com.example.demo.dto.LeadsBySourceDTO;
import com.example.demo.dto.MonthlyLeadsDTO;
import com.example.demo.entity.LeadStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AnalyticsDao {

    @PersistenceContext
    private EntityManager entityManager;

    public Long countTotalLeads(String profileId) {
        return entityManager
                .createQuery(
                        "SELECT COUNT(l) FROM Lead l WHERE l.profileId = :profileId",
                        Long.class
                )
                .setParameter("profileId", profileId)
                .getSingleResult();
    }

    public Long countNewLeads(String profileId) {
        return entityManager
                .createQuery(
                        """
                        SELECT COUNT(l)
                        FROM Lead l
                        WHERE l.status = com.example.demo.entity.LeadStatus.NEW
                        AND l.profileId = :profileId
                        """,
                        Long.class
                )
                .setParameter("profileId", profileId)
                .getSingleResult();
    }

    public Long countQualifiedLeads(String profileId) {
        return entityManager
                .createQuery(
                        """
                        SELECT COUNT(l)
                        FROM Lead l
                        WHERE l.status = com.example.demo.entity.LeadStatus.QUALIFIED
                        AND l.profileId = :profileId
                        """,
                        Long.class
                )
                .setParameter("profileId", profileId)
                .getSingleResult();
    }

    public Long countCampaigns(String profileId) {
        return entityManager
                .createQuery(
                        "SELECT COUNT(c) FROM Campaign c WHERE c.profileId = :profileId",
                        Long.class
                )
                .setParameter("profileId", profileId)
                .getSingleResult();
    }

    // Placeholder until Sales module
    public Double totalRevenue(String profileId) {

        Double revenue = entityManager
                .createQuery(
                        """
                        SELECT COALESCE(SUM(d.amount),0)
                        FROM Deal d
                        WHERE d.stage = com.example.demo.entity.DealStage.WON
                        AND d.profileId = :profileId
                        """,
                        Double.class
                )
                .setParameter("profileId", profileId)
                .getSingleResult();

        return revenue;
    }


    //  FIXED Lead Funnel
    public List<LeadFunnelDTO> getLeadFunnel(String profileId) {

        List<Object[]> rows = entityManager
                .createQuery(
                        """
                        SELECT l.status, COUNT(l)
                        FROM Lead l
                        WHERE l.profileId = :profileId
                        GROUP BY l.status
                        """,
                        Object[].class
                )
                .setParameter("profileId", profileId)
                .getResultList();

        List<LeadFunnelDTO> funnel = new ArrayList<>();

        for (Object[] row : rows) {

            LeadStatus status = (LeadStatus) row[0];
            Long count = (Long) row[1];

            funnel.add(new LeadFunnelDTO(
                    status.name(),
                    count
            ));
        }

        return funnel;
    }

    // Campaign Status
    public List<CampaignStatusDTO> getCampaignStatus(String profileId) {

        return entityManager.createQuery("""
       SELECT new com.example.demo.dto.CampaignStatusDTO(c.status, COUNT(c))
       FROM Campaign c
       WHERE c.profileId = :profileId
       GROUP BY c.status
    """, CampaignStatusDTO.class)
                .setParameter("profileId", profileId)
                .getResultList();
    }

    // Leads By Source
    public List<LeadsBySourceDTO> getLeadsBySource(String profileId) {

        return entityManager.createQuery("""
       SELECT new com.example.demo.dto.LeadsBySourceDTO(
           l.contact.source,
           COUNT(l)
       )
       FROM Lead l
       WHERE l.profileId = :profileId
       GROUP BY l.contact.source
    """, LeadsBySourceDTO.class)
                .setParameter("profileId", profileId)
                .getResultList();
    }

    // Monthly Leads
    public List<MonthlyLeadsDTO> getMonthlyLeads(String profileId) {

        return entityManager.createQuery("""
      SELECT new com.example.demo.dto.MonthlyLeadsDTO(
         MONTH(l.createdAt),
         COUNT(l)
      )
      FROM Lead l
      WHERE l.profileId = :profileId
      GROUP BY MONTH(l.createdAt)
      ORDER BY MONTH(l.createdAt)
    """, MonthlyLeadsDTO.class)
                .setParameter("profileId", profileId)
                .getResultList();
    }


}
