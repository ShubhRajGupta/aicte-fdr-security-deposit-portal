package org.aicte.fdr.rules.engine;

import org.aicte.fdr.registry.Instrument;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class RulesEngine {

    public List<RuleCode> evaluate(Instrument inst, BigDecimal requiredAmount, int requiredYears) {
        List<RuleCode> violations = new ArrayList<>();

        if (inst.amount().compareTo(requiredAmount) < 0) {
            violations.add(RuleCode.RULE_AMT_INSUFFICIENT);
        }
        if (inst.tenorYears() < requiredYears) {
            violations.add(RuleCode.RULE_INVALID_TENOR);
        }
        if (!inst.lienMarked()) {
            violations.add(RuleCode.RULE_MISSING_JOINT_LIEN);
        }

        return violations;
    }
}

